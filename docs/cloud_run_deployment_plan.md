# Cloud Run Deployment Plan — InvoiceInk

Migration plan for moving InvoiceInk from the current single-VPS Docker Compose
deployment (`prod-docker-compose.yml`) to Google Cloud Run.

**Status:** **live and fully verified.** Deployed via CI on every push to `main`.
Every path — web, security split, jobs, scheduler, Cloud Tasks, Gotenberg, and
the queued mail path through to a delivered PDF — has been exercised against
production. Verification record in
[`cloud_run_migration_todo.md`](./cloud_run_migration_todo.md).
**Application:** InvoiceInk — <https://invoiceink.claritytech.io>

---

## 1. Why Cloud Run

The application is low traffic and used for short bursts a few times a week on no
fixed schedule. A VPS bills 24/7 regardless. Cloud Run allocates CPU only while a
request is being processed and scales to zero in between, so idle time costs
nothing.

The design goal is therefore: **no always-on compute anywhere in the stack.**

---

## 2. Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Queue via **Cloud Tasks push queue** | Queued jobs arrive as HTTP requests, so no worker process needs to sit running. Preserves scale-to-zero and delivers email within seconds. |
| 2 | **Gotenberg as a sidecar** in both services | PDF generation is needed on both the web path and the queue path (see §3.1). Sidecars share `localhost`, so no separate service, no network config, no auth code. |
| 3 | **Database external**, unchanged | Already hosted separately. Cloud SQL is deliberately excluded — it cannot scale to zero and would become the cost floor. |
| 4 | DB reachable over the **public internet with TLS** | No IP allowlist in place, so no VPC, no Cloud NAT, no static egress IP required. |
| 5 | **Drop Redis** | Memorystore is always-on with no scale-to-zero. Queue moves to Cloud Tasks; cache and session move to the `database` driver. |
| 6 | **Keep the existing S3/Spaces bucket** | `FILESYSTEM_DISK=s3` and `MEDIA_DISK=s3` already; nothing to migrate. |
| 7 | **Two Cloud Run services** from one image | Required by the security model — see §5. |
| 8 | `maxScale: 1` on both services | Low traffic; acts as a hard budget backstop. |

### 2.1 Rejected options

- **Cloud Run worker pools** — cannot scale to zero, manual scaling only.
- **Scheduled drain Job** (`queue:work --stop-when-empty` on a cron) — viable and
  needs no new dependency, but email is delayed by the poll interval and frequent
  polling means a full Laravel boot per poll. Kept as a fallback.
- **`QUEUE_CONNECTION=sync`** — simplest, but blocks the Send button through two
  Gotenberg renders plus SMTP, and forces media-library conversions inline
  (`queue_conversions_by_default` is `true`).

---

## 3. Application constraints discovered

### 3.1 PDF generation runs on both paths

`DocumentMailer` implements `ShouldQueue`, and its `attachments()` method
(`app/Mail/DocumentMailer.php:105`) calls `PdfService`. So the PDF is built inside
the **queue worker**, not the web request.

Separately, `routes/web.php:44-45` exposes `/invoices/{ulid}/pdf` and
`/estimates/{ulid}/pdf` as **public, unauthenticated web routes**.

**Consequence:** Gotenberg must be reachable from both the web service and
whatever runs the queue.

### 3.2 Every PDF is rendered twice

`PdfService::renderDocument()` renders once to count pages, then again so the
template can pin the footer to the last page. Budget roughly
`2 × render + overhead` for every timeout and memory calculation.

### 3.3 Storage is already cloud-native

Everything user-facing goes to the `s3` disk — media library, logos, invoice
attachments, and `PruneEmailAttachments` (which uses
`config('filesystems.default')`). No local disk state to migrate, and
`AUTORUN_LARAVEL_STORAGE_LINK` is unnecessary.

### 3.4 Scheduled work is two daily commands

From `routes/console.php:12-13`:

```php
Schedule::command('email-attachments:prune')->dailyAt('03:00');
Schedule::command('exchange-rates:fetch')->dailyAt('02:00');
```

Two Cloud Scheduler entries, not a per-minute `schedule:run`.

---

## 4. Target architecture

```
   invoiceink.claritytech.io
            │
            ▼
   ┌──────────────────┐  Worker on route invoiceink.claritytech.io/*
   │   Cloudflare     │  (fetches the *.run.app URL directly, so Host is
   └────────┬─────────┘   correct by construction — see §9.4)
            │
            ▼
                    ┌─────────────────────────────────────┐
                    │ invoicing-web        (public)       │
                    │  ├ app        :8080  ingress        │
                    │  └ gotenberg  :3000  sidecar        │
                    │  concurrency 20 · timeout 120s      │
                    │  CLOUD_TASKS_DISABLE_TASK_HANDLER=1 │
                    └───────────┬─────────────────────────┘
                                │ CreateTask
                                ▼
                    ┌─────────────────────────┐
                    │ Cloud Tasks queue       │
                    │ max-concurrent-dispatch │
                    │            = 1          │
                    └───────────┬─────────────┘
                                │ POST + Google-signed OIDC token
                                ▼
                    ┌─────────────────────────────────────┐
                    │ invoicing-worker  (IAM-only)        │
                    │  ├ app        :8080  ingress        │
                    │  └ gotenberg  :3000  sidecar        │
                    │  concurrency 1 · timeout 900s       │
                    └─────────────────────────────────────┘

  Cloud Scheduler ──► invoicing-exchange-rates  (Job, daily 02:00)
  Cloud Scheduler ──► invoicing-prune           (Job, daily 03:00)
  CI/CD           ──► invoicing-migrate         (Job, on deploy)

  All of the above → external MySQL over TLS
                   → existing S3 / Spaces bucket
```

---

## 5. Security model

### 5.1 How a queued job travels

1. `Mail::send($mailable)` serialises the job (`SerializesModels` stores model
   IDs, not row data).
2. The app calls the Cloud Tasks API to create a task.
3. When dispatching, Cloud Tasks mints a **Google-signed OIDC ID token** whose
   `aud` claim is the worker service URL.
4. It POSTs to `https://<worker>/handle-task` with
   `Authorization: Bearer <token>` plus `X-CloudTasks-*` headers.
5. Cloud Run's front end validates the token **before the container is reached**.
6. `TaskHandler::handle()` deserialises and runs the job.

### 5.2 The package does not verify the token

The commonly quoted claim that *"the package verifies the token is digitally
signed by Google"* describes **v3 and earlier**. `STACKKIT_CLOUD_TASKS_SIGNED_AUDIENCE`
was removed in the 3.x → 4.x upgrade. Verified against the `v6.0.0` tag, the
entire handler is:

```php
public function handle(?string $task = null): void
{
    try {
        $task = IncomingTask::fromJson($task ?: request()->getContent());
    } catch (Exception $e) {
        abort(422, $e->getMessage());
    }
    event(new TaskIncoming($task));

    if (! CloudTasksApi::exists($task->fullyQualifiedTaskName())) {
        abort(404);
    }
    // ... runs the job
}
```

No bearer token check, no audience check, no header check. The only
application-level gate asks the Cloud Tasks API *"does a task with this name still
exist?"* — which stops replays of completed tasks, but a task name is not a secret
and this is **not authentication**.

### 5.3 Therefore: Cloud Run IAM is the only real boundary

| | `invoicing-web` | `invoicing-worker` |
|---|---|---|
| Ingress auth | `--allow-unauthenticated` | `--no-allow-unauthenticated` |
| Who may invoke | anyone | only the Cloud Tasks invoker service account |
| `CLOUD_TASKS_DISABLE_TASK_HANDLER` | **`true`** | `false` |

Both settings are load-bearing:

- **Without the two-service split**, the handler is an unauthenticated public POST
  guarded only by the `exists()` check, reachable by anyone who can guess the
  default URI `handle-task`.
- **Without `CLOUD_TASKS_DISABLE_TASK_HANDLER=true` on web**, the same image
  registers the route on the public service anyway and the split achieves nothing.

### 5.4 Threat model

| Attack | Outcome |
|---|---|
| Random POST to the worker URL | Rejected at the front end — no token |
| Token stolen from another Cloud Run service | Rejected — `aud` mismatch |
| Valid token, service account lacks `run.invoker` | Rejected — IAM |
| Guessing `/handle-task` on the public web service | 404 — route not registered there |
| Replaying a completed task | 404 — `exists()` check |

### 5.5 Service accounts

| Account | Purpose | Roles |
|---|---|---|
| `invoicing-app` | Runtime identity of both services and all jobs | `cloudtasks.enqueuer`, `cloudtasks.viewer`, `cloudtasks.taskDeleter`, `secretmanager.secretAccessor` |
| `invoicing-tasks-invoker` | Identity Cloud Tasks acts as when calling the worker | `run.invoker` on `invoicing-worker` **only** |
| `github-deployer` | CI/CD via Workload Identity Federation | `run.admin`, `artifactregistry.writer`, `iam.serviceAccountUser`, `logging.viewer` |

`logging.viewer` on `github-deployer` is easy to omit and fails in a way that
looks like success: the Artisan workflow runs the command, the Cloud Run Job
completes, and the run goes green — but reading the output back is denied, so
the log block comes out empty and indistinguishable from a command that printed
nothing. It was added after exactly that happened.

`invoicing-app` needs `iam.serviceAccountUser` on `invoicing-tasks-invoker` so it
can instruct Cloud Tasks to mint tokens as that identity.

---

## 6. Current image build (verified)

`docker/production/Dockerfile.frankenphp`, three stages:

| Stage | Base | Does |
|---|---|---|
| `php-deps` | `serversideup/php:8.5-cli` | `composer install --no-dev --optimize-autoloader`, then `COPY . .` and `wayfinder:generate --with-form` with a throwaway `APP_KEY` (the Bun stage has no PHP) |
| `frontend` | `oven/bun:1` | Copies the tree from `php-deps`, `bun install --frozen-lockfile`, `bun run build` with `WAYFINDER_SKIP_GENERATE=1` |
| `production` | `serversideup/php:8.5-frankenphp` | Adds `pdo_mysql exif gd intl bcmath sockets`, copies `php.ini` and the built tree, `composer dump-autoload --classmap-authoritative`, removes `docker/ resources/css resources/js` and the JS toolchain |

`.dockerignore` is already correct — `vendor/`, `node_modules/`, `tests/`,
`public/build/`, `.git/` excluded, so `COPY . .` neither clobbers the installed
vendor nor bloats layers. **No change needed.**

Runtime behaviour is entirely ServerSideUp automations
(`Dockerfile.frankenphp:97-106`). CI (`.github/workflows/docker-build.yml`) builds
`linux/amd64` only and pushes to GHCR.

### 6.1 Blockers

**B1 — Migrations run on every cold start.** `AUTORUN_LARAVEL_MIGRATION=true` is
safe when one container starts once on a VPS. On Cloud Run every scale-from-zero
re-runs it and a burst starts several instances at once. Worse,
`MIGRATION_ISOLATION` takes its lock through the cache store, which is `database`
— so the lock lives in a table created *by* a migration. Chicken-and-egg on first
deploy.

**B2 — `max_execution_time = 30` in two places will kill PDF jobs.**
`docker/production/php.ini:5` and `config/octane.php:222`. Two Gotenberg renders
plus SMTP can exceed 30s on a cold instance; Octane aborts mid-job, Cloud Tasks
retries, and the customer gets a duplicate invoice email.

**B3 — Port is hardcoded.** `--port=8080` in the `CMD`. The Cloud Run contract is
to listen on `$PORT` at `0.0.0.0`. It works today only because the default happens
to be 8080.

**B4 — `--workers=auto`** sizes off detected CPUs; under Cloud Run's limits this
should not be left to chance.

**B5 — Sidecar port rule.** Per the container contract: *"for a service containing
sidecars, there is no default port for the ingress container. You must explicitly
configure the container port... and only one container can have the port
exposed."*

**B6 — `AUTORUN_LARAVEL_OPTIMIZE=true`** runs the whole `optimize` bundle on every
cold start. Only `view:cache` and `event:cache` are environment-independent and can
be baked into the image; `config:cache` **and `route:cache`** must stay at container
start — see §7.1.1 for why baking route caching is actively unsafe here.
ServerSideUp exposes the caches individually, so no custom entrypoint is needed.

**B7 — App name mismatch.** `config/app.php:16`, `.env.example:1` and
`resources/js/app.ts:3` all say `InvoiceInk`, but
`docker/production/Dockerfile.frankenphp:60` and
`.github/workflows/docker-build.yml:96` bake `Clarity InvoiceInk` into the
frontend bundle. `VITE_APP_NAME` is a **build-time** value — fixing it requires a
rebuild, not an env change.

### 6.2 Registry — correction

Cloud Run **can** pull public images from GHCR and Docker Hub (cached up to one
hour). `ghcr.io/clarity-tech/invoicing:latest` was verified publicly pullable
(anonymous manifest fetch returns HTTP 200), so the existing pipeline would work
unmodified.

Artifact Registry is still recommended: same-region pulls measurably improve cold
start, and it removes an external dependency from the deploy path.

---

## 7. Code changes

### 7.1 `docker/production/Dockerfile.frankenphp`

Line 60:

```dockerfile
ARG VITE_APP_NAME="InvoiceInk"
```

Replace the `composer dump-autoload` block, the `ENV` block and the `CMD`:

```dockerfile
# Rebuild autoload classmap with full app code, bake the env-independent caches,
# then clean up in a single layer.
#
# view:cache compiles Blade templates and event:cache scans listener classes —
# neither depends on the environment, so baking them removes that work from
# every cold start.
#
# route:cache is deliberately NOT baked — see §7.1.1.
# config:cache is likewise left to runtime; it would freeze build-time env.
ARG BUILD_APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev \
    && APP_ENV=production APP_DEBUG=false APP_KEY=${BUILD_APP_KEY} \
       php artisan view:cache \
    && APP_ENV=production APP_DEBUG=false APP_KEY=${BUILD_APP_KEY} \
       php artisan event:cache \
    && rm -rf docker resources/css resources/js \
        vite.config.ts tsconfig.json eslint.config.js .prettierrc \
        package.json bun.lock

ENV AUTORUN_ENABLED=true \
    # Migrations move to a dedicated Cloud Run Job. The VPS sets this back to
    # true in app.env, where single-container startup makes it safe.
    AUTORUN_LARAVEL_MIGRATION=false \
    AUTORUN_LARAVEL_MIGRATION_ISOLATION=true \
    # Only config:cache needs runtime env; the rest are baked above.
    AUTORUN_LARAVEL_OPTIMIZE=false \
    AUTORUN_LARAVEL_CONFIG_CACHE=true \
    AUTORUN_LARAVEL_ROUTE_CACHE=true \
    AUTORUN_LARAVEL_VIEW_CACHE=false \
    AUTORUN_LARAVEL_EVENT_CACHE=false \
    # Everything user-facing lives on S3; no public symlink needed.
    AUTORUN_LARAVEL_STORAGE_LINK=false \
    PHP_OPCACHE_ENABLE=1 \
    SSL_MODE=off \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    OCTANE_WORKERS=4 \
    OCTANE_MAX_REQUESTS=500

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD ["healthcheck-octane"]

# Shell form so Cloud Run's injected $PORT is honoured. Workers are explicit
# rather than "auto" so the count doesn't drift with the CPU limit.
CMD ["sh", "-c", "php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=${PORT:-8080} --workers=${OCTANE_WORKERS:-4} --max-requests=${OCTANE_MAX_REQUESTS:-500}"]
```

> The `AUTORUN_LARAVEL_MIGRATION=false` default is the one change that affects the
> existing VPS deploy. Set `AUTORUN_LARAVEL_MIGRATION=true` in the VPS `app.env`
> to preserve current behaviour there.

### 7.1.1 Why `route:cache` is not baked

An earlier draft of this plan baked `route:cache` at build time alongside the view
and event caches. **That would have silently defeated the §5.3 security split.**

The Cloud Tasks package registers its handler conditionally
(`CloudTasksServiceProvider::registerRoutes()`, verified in the installed v6):

```php
private function registerRoutes(): void
{
    if (config('cloud-tasks.disable_task_handler')) {
        return;
    }
    $router->post(config()->string('cloud-tasks.uri'), [TaskHandler::class, 'handle'])
        ->name('cloud-tasks.handle-task');
}
```

At build time `CLOUD_TASKS_DISABLE_TASK_HANDLER` is unset, so it defaults to
`false` and `POST /handle-task` gets compiled **into the cached route file**. At
runtime the web service sets the flag to `true` — but that only makes
`registerRoutes()` return early. Laravel loads the compiled routes rather than
re-evaluating the condition, so the handler would have been live on the public
service anyway, guarded by nothing but the `exists()` check.

The general rule: **route registration can depend on runtime configuration, so
route caching belongs at container start, not build time.** View and event caches
have no such dependency and remain baked.

### 7.2 `docker/production/php.ini`

```ini
max_execution_time = 300
```

### 7.3 `config/octane.php`

```php
'max_execution_time' => (int) env('OCTANE_MAX_EXECUTION_TIME', 300),
```

### 7.4 `config/services.php`

The Gotenberg HTTP client timeout is the binding constraint in the timeout ladder
(§11.1) and must clear a two-pass render:

```php
'timeout' => env('GOTENBERG_TIMEOUT', 90),
```

### 7.5 `.github/workflows/docker-build.yml`

Line 96:

```yaml
            VITE_APP_NAME=InvoiceInk
```

> The string `Clarity InvoiceInk` also appears in `Dockerfile.nginx-fpm:43`,
> `Dockerfile.standalone:43` and both `docker/production/docker-compose.*.yml`
> files. Those are commented out of CI and unused by the FrankenPHP path — worth
> correcting for consistency, but they do not affect this deployment.

---

## 8. GCP resource setup

```bash
export PROJECT=invoiceink-prod
export REGION=<your region>       # match your MySQL host's region
export REPO=docker

gcloud config set project $PROJECT
gcloud services enable run.googleapis.com cloudtasks.googleapis.com \
  cloudscheduler.googleapis.com artifactregistry.googleapis.com \
  secretmanager.googleapis.com iamcredentials.googleapis.com

gcloud artifacts repositories create $REPO \
  --repository-format=docker --location=$REGION

# Mirror Gotenberg into AR — sidecars pull under the same rules as the ingress
# container, and this avoids Docker Hub rate limits on cold start.
gcloud auth configure-docker $REGION-docker.pkg.dev
docker pull --platform linux/amd64 gotenberg/gotenberg:8
docker tag gotenberg/gotenberg:8 $REGION-docker.pkg.dev/$PROJECT/$REPO/gotenberg:8
docker push $REGION-docker.pkg.dev/$PROJECT/$REPO/gotenberg:8
```

### 8.1 Service accounts

```bash
gcloud iam service-accounts create invoicing-app
APP_SA=invoicing-app@$PROJECT.iam.gserviceaccount.com

gcloud iam service-accounts create invoicing-tasks-invoker
TASK_SA=invoicing-tasks-invoker@$PROJECT.iam.gserviceaccount.com

for ROLE in roles/cloudtasks.enqueuer roles/cloudtasks.viewer \
            roles/cloudtasks.taskDeleter roles/secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding $PROJECT \
    --member=serviceAccount:$APP_SA --role=$ROLE
done

gcloud iam service-accounts add-iam-policy-binding $TASK_SA \
  --member=serviceAccount:$APP_SA --role=roles/iam.serviceAccountUser
```

### 8.2 Cloud Tasks queue

`--max-concurrent-dispatches=1` matches the worker's `maxScale: 1` +
`containerConcurrency: 1`. Without it, Cloud Tasks would dispatch a second task
while the first is running, get a 429 from Cloud Run, and burn retry attempts on
congestion rather than on real errors. With it, the queue becomes the buffer.

```bash
gcloud tasks queues create invoicing-default --location=$REGION \
  --max-concurrent-dispatches=1 \
  --max-dispatches-per-second=1 \
  --max-attempts=5 \
  --min-backoff=10s \
  --max-backoff=300s
```

### 8.3 Secrets

```bash
for S in APP_KEY DB_PASSWORD MAIL_PASSWORD AWS_SECRET_ACCESS_KEY; do
  gcloud secrets create $S --replication-policy=automatic
done
# printf '%s' "$VALUE" | gcloud secrets versions add APP_KEY --data-file=-
```

> `APP_KEY` **must** be the same value production uses today. Changing it
> invalidates every existing session and makes anything encrypted with the old key
> unreadable.

---

## 9. Cloud Run services

Sidecars require YAML; the flag syntax cannot express them cleanly.

### 9.1 / 9.2 Service manifests

The manifests live in the repo and are the single source of truth — they are not
duplicated here, so they cannot drift from what actually deploys:

- `deploy/cloudrun/web.yaml` — public service
- `deploy/cloudrun/worker.yaml` — private queue handler

Both are templates. Placeholder tokens are wrapped in double underscores so a
substitution can never match an environment variable **name** (a bare `PROJECT`
would also rewrite `CLOUD_TASKS_PROJECT` into nonsense):

| Token | Source |
|---|---|
| `__PROJECT__` | `vars.GCP_PROJECT` |
| `__REGION__` | `vars.GCP_REGION` |
| `__TAG__` | `github.sha` |
| `__WORKER_URL__` | read back from the deployed worker service |
| `__DB_HOST__` | `vars.GCP_DB_HOST` |
| `__DB_NAME__` | `vars.GCP_DB_NAME` |
| `__DB_USER__` | `vars.GCP_DB_USER` |

`APP_KEY`, `DB_PASSWORD`, `MAIL_PASSWORD` and `AWS_SECRET_ACCESS_KEY` are not
tokens — the manifests reference Secret Manager directly via `secretKeyRef`.

The deploy step renders each manifest and then asserts no `__TOKEN__` survives,
so a missing repository variable fails the deploy instead of shipping a literal
placeholder as a hostname.

Key differences between the two, all covered in §12:

| | web | worker |
|---|---|---|
| `containerConcurrency` | 20 | 1 |
| `timeoutSeconds` | 120 | 900 |
| `OCTANE_WORKERS` | 4 | 1 |
| `OCTANE_MAX_EXECUTION_TIME` | 60 | 300 |
| `CLOUD_TASKS_DISABLE_TASK_HANDLER` | `true` | `false` |

Both declare `containerPort: 8080` on the `app` container — with sidecars present
there is no default ingress port (B5) — and both carry the Gotenberg sidecar.

### 9.3 Deploy and lock down

```bash
gcloud run services replace deploy/cloudrun/web.yaml    --region=$REGION
gcloud run services replace deploy/cloudrun/worker.yaml --region=$REGION

gcloud run services add-iam-policy-binding invoicing-web \
  --region=$REGION --member=allUsers --role=roles/run.invoker

# Worker: only the Cloud Tasks invoker identity, nobody else
gcloud run services add-iam-policy-binding invoicing-worker \
  --region=$REGION --member=serviceAccount:$TASK_SA --role=roles/run.invoker
```

### 9.4 Custom domain — Cloudflare proxy

**Cloud Run domain mapping is not available in either Indian region.** Domain
mappings exist in only nine regions — `asia-east1`, `asia-northeast1`,
`asia-southeast1`, `europe-north1`, `europe-west1`, `europe-west4`, `us-central1`,
`us-east1`, `us-east4`, `us-west1`. Neither `asia-south1` (Mumbai) nor
`asia-south2` (Delhi) is on it.

**Decision: front the service with Cloudflare**, which already hosts DNS for
`claritytech.io`. This keeps the design's no-always-on-cost property — a GCP
external load balancer would have added an hourly forwarding rule and static IP
regardless of traffic.

#### Configuration — a Worker, not an Origin Rule

The obvious approach is a proxied CNAME plus an Origin Rule rewriting the `Host`
header, because Cloud Run routes by hostname and rejects a request whose `Host`
it does not serve. **That approach does not work on this zone**, for a reason
that has nothing to do with the rewrite:

> `claritytech.io` runs in **Flexible** SSL mode, meaning Cloudflare reaches
> origins over plaintext HTTP. Cloud Run serves HTTPS only and `301`s plaintext,
> so fixing the `Host` header would simply trade the 404 for a redirect loop.
> Switching the zone to Full is **not** a local change — the SSL mode is
> zone-wide and would apply to every other site on the domain, several of which
> may not present a valid certificate.

So the implementation is a **Cloudflare Worker** (`deploy/cloudflare/`):

1. **DNS** — a proxied record for `invoiceink` must exist, since Worker routes
   require one. Its target is irrelevant; the Worker never follows it.
2. **Worker** — bound to route `invoiceink.claritytech.io/*`. It calls
   `fetch()` against the `.run.app` URL explicitly, and `fetch()` derives `Host`
   from the URL it is given — so the header is correct **by construction** and
   there is nothing to override. It also makes its own HTTPS connection, so the
   zone SSL mode does not apply to it and does not have to change.
3. **Nothing else** — no zone-wide setting is touched, and no other hostname on
   the zone is affected.

Deploy it with `cd deploy/cloudflare && bunx wrangler deploy`; roll it back with
`bunx wrangler delete`, which unbinds the route.

> Cloudflare's built-in Host header override may also be plan-gated. Community
> reports describe a `not entitled` error on non-Enterprise zones, though the
> current documentation states no such restriction. It is moot here — the SSL
> mode rules the approach out regardless.

#### Why the app needs no changes

- `APP_URL` is set explicitly to the public domain on both services, so
  `route()` and mail links are unaffected by the rewritten `Host`.
- `trustProxies(at: '*')` (`bootstrap/app.php:23`) already honours
  `X-Forwarded-*` from the proxy chain.
- Session cookies are issued without a `Domain` attribute (`SESSION_DOMAIN=null`),
  so the browser scopes them to the address bar hostname, not the origin `Host`.

#### Accepted trade-off

The `.run.app` URL stays publicly reachable, so anyone who discovers it bypasses
Cloudflare's WAF and rate limiting. **Accepted for now** — the URL is not
practically guessable and the application enforces its own authentication.

Two ways to close it later, in increasing order of cost:

- A shared secret header injected by a Cloudflare Origin Rule and validated by
  Laravel middleware. No infrastructure, but a code change and a secret to rotate.
- A GCP external ALB with `ingress: internal-and-cloud-load-balancing`, which
  makes the `.run.app` URL unreachable from the internet. Enforced by Google
  rather than by application code, at the cost of the hourly forwarding rule.

---

## 10. Jobs and scheduling

```bash
IMAGE=$REGION-docker.pkg.dev/$PROJECT/$REPO/invoicing:TAG

gcloud run jobs create invoicing-migrate --region=$REGION --image=$IMAGE \
  --service-account=$APP_SA --max-retries=0 --task-timeout=600s \
  --command=php --args=artisan,migrate,--force

gcloud run jobs create invoicing-prune --region=$REGION --image=$IMAGE \
  --service-account=$APP_SA --command=php --args=artisan,email-attachments:prune

gcloud run jobs create invoicing-exchange-rates --region=$REGION --image=$IMAGE \
  --service-account=$APP_SA --command=php --args=artisan,exchange-rates:fetch
```

```bash
gcloud scheduler jobs create http invoicing-exchange-rates-daily --location=$REGION \
  --schedule="0 2 * * *" --time-zone="UTC" \
  --uri="https://$REGION-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/$PROJECT/jobs/invoicing-exchange-rates:run" \
  --http-method=POST --oauth-service-account-email=$APP_SA

gcloud scheduler jobs create http invoicing-prune-daily --location=$REGION \
  --schedule="0 3 * * *" --time-zone="UTC" \
  --uri="https://$REGION-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/$PROJECT/jobs/invoicing-prune:run" \
  --http-method=POST --oauth-service-account-email=$APP_SA
```

Two scheduled commands, two Scheduler entries. Avoid a per-minute `schedule:run`
— that is 1,440 full Laravel boots a day to service two daily jobs. If the
schedule grows past ~5 entries, switch to a single `schedule:run` job on a coarser
cadence.

---

## 11. Environment variables

Set on **both** services unless noted.

```bash
APP_NAME=InvoiceInk
APP_URL=https://invoiceink.claritytech.io
MAIL_FROM_NAME=InvoiceInk

QUEUE_CONNECTION=cloudtasks
CLOUD_TASKS_PROJECT=invoiceink-prod
CLOUD_TASKS_LOCATION=<region>
CLOUD_TASKS_QUEUE=invoicing-default
CLOUD_TASKS_SERVICE_EMAIL=invoicing-tasks-invoker@PROJECT.iam.gserviceaccount.com
CLOUD_TASKS_HANDLER=https://invoicing-worker-xxxx.run.app   # WORKER url, not web

CACHE_STORE=database
SESSION_DRIVER=database
FILESYSTEM_DISK=s3            # unchanged — keep the existing bucket
LOG_CHANNEL=stderr
OCTANE_HTTPS=true

DB_CONNECTION=mysql
DB_HOST=<external host>
MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt   # config/database.php:63

GOTENBERG_URL=http://localhost:3000
GOTENBERG_TIMEOUT=90
```

All `REDIS_*` variables can be removed.

### 11.1 `CLOUD_TASKS_HANDLER` is mandatory

The package derives the handler URL from the app URL when this variable is absent.
With `APP_URL` set to the public domain, the default would send every task to
`invoiceink.claritytech.io` — the *web* service, where the handler is disabled.
Result: 404, Cloud Tasks retries, jobs never run.

### 11.2 `APP_URL` must be the public domain on the worker too

`DocumentMailer::getPublicViewUrl()` calls `route()`, and that runs on the worker.
If the worker's `APP_URL` were its own `.run.app` URL, every "View invoice online"
button in customer emails would point at an IAM-locked service and 403.

### 11.3 `OCTANE_HTTPS=true`

`config/octane.php:53` defaults to `false`. TLS terminates at Cloud Run's edge, so
the container sees plain HTTP with `X-Forwarded-Proto: https`. `trustProxies(at: '*')`
(`bootstrap/app.php:23`) should handle it, but the failure mode is `http://` links
in customer-facing invoice emails. Setting this removes the doubt at no cost.

---

## 12. Sizing

| | `invoicing-web` | `invoicing-worker` |
|---|---|---|
| `minScale` | 0 | 0 |
| `maxScale` | 1 | 1 |
| `containerConcurrency` | 20 | 1 |
| app container | 1 vCPU / 2 GiB | 1 vCPU / 2 GiB |
| gotenberg container | 1 vCPU / 1 GiB | 1 vCPU / 1 GiB |
| instance total | 2 vCPU / 3 GiB * | 2 vCPU / 3 GiB * |

> \* **Unverified.** Both the CPU-limits and memory-limits pages explicitly decline
> to state whether per-container limits sum to an instance total or are enforced
> independently for multi-container services. The values above assume they sum,
> which fits within the documented 2 vCPU → 8 GiB ceiling. Confirm at the first
> `gcloud run services replace` — if the assumption is wrong the manifest is
> rejected there, before anything is running.
| `OCTANE_WORKERS` | 4 | 1 |
| ceiling | 20 queued requests | 1 PDF job at a time |

### 12.1 `containerConcurrency` vs Octane workers

They are separate, stacked layers:

- **`containerConcurrency`** is an admission setting — how many requests Cloud Run
  will route to one instance. Normally it triggers scale-out; with `maxScale: 1`
  it becomes purely the 429 threshold.
- **`--workers`** is execution — the count of PHP processes, each holding a booted
  Laravel app and looping. This is the real parallelism.

With `containerConcurrency` (20) > workers (4), surplus requests queue inside
FrankenPHP and wait rather than failing. That is the safe direction, and the
reason to leave it at 20 rather than matching it to 4 — with a single instance it
is free buffer.

4 workers on 1 vCPU is not oversubscribed for this workload: nearly every request
blocks on I/O outside the container (external MySQL for both session and cache,
Gotenberg, S3, SMTP), and a blocked worker uses no CPU.

The worker service is the inverse — `containerConcurrency: 1` means one job at a
time, so more than one Octane worker is just idle processes holding memory and a
DB connection.

### 12.2 Database connections

Octane holds a persistent PDO connection **per worker**:

```
web     1 instance × 4 workers = 4
worker  1 instance × 1 worker  = 1
jobs    migrate / prune / rates ≈ 3
                                 ───
                                   8 connections
```

Recompute this if `maxScale` or `OCTANE_WORKERS` ever rises — it binds before CPU
or memory does. `--max-requests=500` recycles workers, cycling connections rather
than leaking them.

### 12.3 Memory

`php.ini:4` sets `memory_limit = 256M` per worker. At 4 workers that is 1024M —
exactly a 1 GiB container limit. It is a per-request ceiling rather than typical
usage (a normal request is 20–60MB), but PDFs are held as raw strings in memory
(`Attachment::fromData(fn () => $pdf, ...)`) and Cloud Run's writable filesystem is
**in-memory and counts against the same limit**. Hence 2 GiB for the app
container. Instance total of 3 GiB remains well under the 8 GiB permitted at
2 vCPU.

### 12.4 `maxScale: 1` consequences

- **Deploys** get a brief exposure window: during a revision rollout Cloud Run
  wants to start the new instance while the old drains, and a hard cap of 1 leaves
  no room. Expect the possibility of a few seconds of 429s at deploy time. If it
  becomes noticeable, `maxScale: 2` on web only is the minimal fix and costs
  nothing while idle.
- **The worker does not idle.** It sits at zero instances and Cloud Tasks wakes it
  by HTTP. `maxScale: 1` caps how many can exist, so jobs run strictly serially —
  ten queued emails process one after another over a few minutes.

---

## 13. Timeout ladder

Six timeouts sit between a click and a delivered PDF. They must increase outward
or the innermost silently wins. The current values do not.

| Layer | Where | Now | Target |
|---|---|---|---|
| Gotenberg API | `--api-timeout` | `30s` | `60s` |
| Laravel HTTP client | `config/services.php:44` | **`30`** | `90` |
| Octane request | `config/octane.php:222` | **`30`** | `300` |
| PHP | `php.ini:5` | **`30`** | `300` |
| Cloud Run request | `timeoutSeconds` | — | `120` web / `900` worker |
| Cloud Tasks | `dispatch_deadline` | — | `600` |

Raising `max_execution_time` alone accomplishes nothing — `GOTENBERG_TIMEOUT=30`
aborts first. This is a live constraint on the current VPS deployment too, not
only a Cloud Run concern.

---

## 14. CI/CD

One-time Workload Identity Federation setup (no service-account JSON keys in
GitHub):

```bash
gcloud iam workload-identity-pools create github --location=global
gcloud iam workload-identity-pools providers create-oidc github \
  --location=global --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='clarity-tech/invoicing'"

gcloud iam service-accounts create github-deployer
DEPLOY_SA=github-deployer@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$DEPLOY_SA --role=$ROLE
done
```

Replace the placeholder `deploy-production` job in
`.github/workflows/docker-build.yml`:

```yaml
  deploy-production:
    needs: [build-and-push]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    permissions:
      contents: read
      id-token: write            # required for Workload Identity Federation
    steps:
      - uses: actions/checkout@v6

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github
          service_account: github-deployer@PROJECT.iam.gserviceaccount.com

      - uses: google-github-actions/setup-gcloud@v2

      - name: Mirror image into Artifact Registry
        run: |
          gcloud auth configure-docker $REGION-docker.pkg.dev --quiet
          SRC=ghcr.io/${{ github.repository }}@${{ needs.build-and-push.outputs.digest }}
          DST=$REGION-docker.pkg.dev/$PROJECT/docker/invoicing:${{ github.sha }}
          docker buildx imagetools create --tag "$DST" "$SRC"

      # Migrations run once, to completion, before any new revision serves traffic.
      - name: Run migrations
        run: |
          gcloud run jobs update invoicing-migrate --region=$REGION \
            --image=$REGION-docker.pkg.dev/$PROJECT/docker/invoicing:${{ github.sha }}
          gcloud run jobs execute invoicing-migrate --region=$REGION --wait

      - name: Deploy services
        run: |
          for SVC in web worker; do
            sed "s|TAG|${{ github.sha }}|g" deploy/cloudrun/$SVC.yaml > /tmp/$SVC.yaml
            gcloud run services replace /tmp/$SVC.yaml --region=$REGION
          done
```

The `build-and-push` job needs `outputs: digest: ${{ steps.build.outputs.digest }}`
added so the deploy job references the exact image built rather than re-resolving
`latest`.

---

## 15. Cutover sequence

1. Apply §7 code changes. Confirm the existing VPS deploy still works with
   `AUTORUN_LARAVEL_MIGRATION=true` set in `app.env`.
2. `composer require stackkit/laravel-google-cloud-tasks-queue` (v6.0.0 supports
   Laravel 13 / PHP 8.1+) and add the `cloudtasks` connection to
   `config/queue.php`.
3. Run §8. Push secrets — **same `APP_KEY` as current production**.
4. Deploy both services with `QUEUE_CONNECTION=sync` first. This proves the app,
   DB, S3 and Gotenberg sidecar all work before the queue is in play.

   > Under `sync`, `DocumentMailer::attachments()` runs inline on the web request,
   > which has `timeoutSeconds: 120`. Per §13 a two-pass render sits inside a 90s
   > client timeout, so a cold-start test send can exceed 120s and fail for reasons
   > unrelated to what is being tested. Smoke-test with the public
   > `/invoices/{ulid}/pdf` route and a non-PDF email, or raise web
   > `timeoutSeconds` temporarily for this step only.
5. Flip to `cloudtasks`. Send one test invoice. Confirm the task lands on the
   worker, and that an unauthenticated `curl` to the worker is rejected.
6. Point `invoiceink.claritytech.io` at the web service (§9.4).
7. Keep the VPS running a week before decommissioning.

---

## 16. Risks and open items

**Duplicate emails on retry.** Cloud Tasks retries any non-2xx or timeout.
`DocumentMailer` has no idempotency guard, so if SMTP succeeds and the handler then
times out, the invoice sends twice. Fixing the timeout ladder (§13) makes this
unlikely, not impossible. A `sent_at` guard on the invoice would close it properly
— an application change, deliberately out of scope for this deployment plan.

**Session latency.** With the DB external to GCP, every request makes a round trip
for the session. Co-locating the region helps most. `SESSION_DRIVER=cookie` would
eliminate the read entirely at the cost of a ~4KB ceiling on session data — worth
testing once running.

**Cold starts.** Octane boot plus `config:cache` on a scale-from-zero instance.
Baking route/view/event caches helps and startup CPU boost helps more, but this
should be measured rather than predicted. If unacceptable, `minScale: 1` on web is
the lever — at the cost of idle billing, which is what this design exists to avoid.

**Cost.** Cloud Run and Cloud Tasks should be near-free at this volume; the
external DB is billed independently as today. Verify against the
[GCP pricing calculator](https://cloud.google.com/products/calculator) rather than
estimating.

---

## 17. Parked — tuning backlog

Not required for cutover. Revisit with real measurements.

| Item | Notes |
|---|---|
| `CollectGarbage` listener | Commented out at `config/octane.php:106`, which means `'garbage' => 50` at line 209 does nothing — that threshold is only read by that listener. Enabling it on the worker is reasonable given PDF jobs allocate large strings, but the config file is shared, so it would need to be env-conditional. |
| `--max-requests` per service | Lower (~100) on the worker bounds leaks more aggressively; higher on web avoids re-boot cost. |
| `OCTANE_WORKERS` on web | 4 is a reasonable start for an I/O-bound workload. 6–8 is defensible once measured. |
| Execution environment | gen2 has better network throughput (relevant with an external DB); gen1 has faster cold starts. Start gen1, test gen2 if DB latency dominates. |
| `SESSION_DRIVER=cookie` | Largest available latency win — removes a DB round trip per request. |
| Octane cache / Swoole tables | **Unavailable.** `config/octane.php:141-172` are Swoole-only and do not work under FrankenPHP. Cache stays on the database driver. |

---

## 18. Verified references

- [Cloud Run container runtime contract](https://docs.cloud.google.com/run/docs/container-contract)
- [Deploy container images to Cloud Run](https://docs.cloud.google.com/run/docs/deploying)
- [Configure containers for jobs (sidecars)](https://docs.cloud.google.com/run/docs/configuring/jobs/containers)
- [Cloud Run CPU limits](https://docs.cloud.google.com/run/docs/configuring/services/cpu)
- [Cloud Run memory limits](https://docs.cloud.google.com/run/docs/configuring/services/memory-limits)
- [Cloud Run maximum instances](https://docs.cloud.google.com/run/docs/configuring/max-instances)
- [Cloud Run service-to-service authentication](https://docs.cloud.google.com/run/docs/authenticating/service-to-service)
- [Cloud Run worker pools](https://docs.cloud.google.com/run/docs/deploy-worker-pools)
- [Creating HTTP target tasks](https://docs.cloud.google.com/tasks/docs/creating-http-target-tasks)
- [Configuring Cloud Tasks queues](https://docs.cloud.google.com/tasks/docs/configuring-queues)
- [Cloud Tasks quotas](https://docs.cloud.google.com/tasks/docs/quotas)
- [ServerSideUp Laravel automations](https://serversideup.net/open-source/docker-php/docs/framework-guides/laravel/automations)
- [stackkit/laravel-google-cloud-tasks-queue](https://github.com/stackkit/laravel-google-cloud-tasks-queue)
