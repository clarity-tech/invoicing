# Cloud Run Migration — TODO

Living progress tracker for the migration described in
[`cloud_run_deployment_plan.md`](./cloud_run_deployment_plan.md).

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked · `[-]` not applicable

**Branch:** `fix/may-changes` (working in place; nothing committed yet)
**Last updated:** 2026-08-01 — Phases A–C complete, D/E pending GCP access

---

## Progress

| Phase | Done | Total |
|---|---|---|
| A — Repo code changes | **11** | 11 |
| B — Dependency + queue config | **3** | 3 |
| C — Verification | **6** | 6 |
| D — GCP provisioning | **10** | 11 |
| M — Manual first deploy | **12** | 12 |
| E — Cutover | 0 | 7 |

**The application is live on Cloud Run** at
`https://invoicing-web-823788548123.asia-south1.run.app` and serving 200s.
Remaining: point Cloudflare at it (D7), set the CI repository variables (D8),
and the Phase E cutover checks.

**Phases A–C complete.** Phase D is mostly provisioned in project `invoiceink`
(`asia-south1`); what remains needs values only the user has — secret contents,
DB connection details, and the Cloudflare DNS change.

---

## Phase A — Repo code changes

Owner: assistant. No GCP access required.

- [x] **A1** `docker/production/Dockerfile.frankenphp:60` — `ARG VITE_APP_NAME="InvoiceInk"`
      *(plan §7.1, blocker B7)*
- [x] **A2** `.github/workflows/docker-build.yml:96` — `VITE_APP_NAME=InvoiceInk`
      *(plan §7.5, blocker B7)*
- [x] **A3** Dockerfile — bake `route:cache` / `view:cache` / `event:cache` at build
      *(plan §7.1, blocker B6)*
- [x] **A4** Dockerfile — rewrite `ENV` block: migration off, granular `AUTORUN_*` caches,
      storage-link off, `OCTANE_WORKERS` / `OCTANE_MAX_REQUESTS` defaults
      *(plan §7.1, blockers B1 + B6)*
- [x] **A5** Dockerfile — `CMD` in shell form honouring `${PORT:-8080}` + explicit workers
      *(plan §7.1, blockers B3 + B4)*
- [x] **A6** `docker/production/php.ini:5` — `max_execution_time = 300`
      *(plan §7.2, blocker B2)*
- [x] **A7** `config/octane.php:222` — `env('OCTANE_MAX_EXECUTION_TIME', 300)`
      *(plan §7.3, blocker B2)*
- [x] **A8** `config/services.php:44` — `GOTENBERG_TIMEOUT` default `30` → `90`
      *(plan §7.4, §13 — live bug on the current VPS too)*
- [x] **A9** New `deploy/cloudrun/web.yaml` *(plan §9.1)*
- [x] **A10** New `deploy/cloudrun/worker.yaml` *(plan §9.2)*
- [x] **A11** `.github/workflows/docker-build.yml` — add `digest` output to `build-and-push`
      and replace the placeholder `deploy-production` job *(plan §14)*

## Phase B — Dependency + queue config

Owner: assistant. Requires Sail running.

- [x] **B1** `composer require stackkit/laravel-google-cloud-tasks-queue` — installed
      at `^6.0`, package discovery succeeded
- [x] **B2** Added the `cloudtasks` connection to `config/queue.php`, including
      `dispatch_deadline` (600s, must clear two Gotenberg renders plus SMTP)
- [x] **B3** No publish needed — `vendor/.../config/cloud-tasks.php` reads
      `CLOUD_TASKS_URI` (default `handle-task`) and `CLOUD_TASKS_DISABLE_TASK_HANDLER`
      straight from env, which the service YAML sets. Env var name verified against
      the installed source.

## Phase C — Verification

Owner: assistant.

- [x] **C1** `docker build --target production` — passed (exit 0)
- [x] **C2** Ran with `PORT=9090` — `/up` responded on the injected port; with `PORT`
      unset it still serves on 8080. **Also verified the §5.3 security control
      end to end:** `CLOUD_TASKS_DISABLE_TASK_HANDLER=true` → `route:list` shows no
      handler; `=false` → `POST handle-task` present. This is what caught the
      route-cache flaw below.
- [x] **C3** `pint --dirty` → `{"tool":"pint","result":"passed"}`
- [x] **C4** 56 tests / 141 assertions passed across `PdfServiceTest`,
      `PdfServiceMockTest`, `ServiceBindingTest`, `PdfServiceIntegrationTest`,
      `DocumentMailerIntegrationTest`, `PublicViewControllerTest`
- [x] **C5** Full suite: 1283 tests, **1159 passed, 119 failed — all 119 are
      `Tests\Browser\*` failing inside `pest-plugin-browser/src/Playwright/Client.php`.**
      Chromium is not installed on the host (it is a container-side
      `sail composer browser-setup` step). Zero non-browser failures.
      Needed `php -d memory_limit=2G vendor/bin/pest`; `artisan test -d …` does not
      propagate, as it shells out to a child PHP process.
- [x] **C6** Manifest validation — `web.yaml`, `worker.yaml` and the workflow all
      parse; a simulated render leaves no `__TOKEN__` behind; exactly one container
      declares a port in each service; `CLOUD_TASKS_PROJECT` survives substitution
      intact (the regression that motivated the token change).

## Phase D — GCP provisioning

Owner: **user** — needs project, region, billing and credentials. Plan §8 has the
commands ready to paste.

- [x] **D1** Region chosen: **`asia-south1`** (Mumbai, Tier 1). Project: existing
      (id pending — needs `gcloud auth login` first)
- [x] **D2** APIs enabled (run, cloudtasks, scheduler, artifactregistry, secretmanager,
      iamcredentials, sts); Artifact Registry repo `docker` created in `asia-south1`;
      `gotenberg:8` mirrored in
- [x] **D3** Service accounts created and bound:
      `invoicing-app` (enqueuer/viewer/taskDeleter/secretAccessor),
      `invoicing-tasks-invoker` (no project roles — only `run.invoker` on the worker,
      granted at first deploy), `github-deployer` (run.admin, artifactregistry.writer,
      iam.serviceAccountUser). `invoicing-app` may impersonate `invoicing-tasks-invoker`.
- [x] **D4** Cloud Tasks queue `invoicing-default` created —
      `maxConcurrentDispatches: 1`, `maxDispatchesPerSecond: 1`, `maxAttempts: 5`,
      backoff 10s–300s. Verified in the describe output.
- [~] **D5** Secret containers created (`APP_KEY`, `DB_PASSWORD`, `MAIL_PASSWORD`,
      `AWS_SECRET_ACCESS_KEY`) — **no versions yet, user must add the values**
- [x] **D6** Workload Identity Federation configured. Pool `github`, provider `github`,
      attribute condition pinned to `clarity-tech/invoicing` (verified against
      `git remote`). Deployer impersonation bound to that repo only.
      `GCP_WIF_PROVIDER` = `projects/823788548123/locations/global/workloadIdentityPools/github/providers/github`
- [x] **D9** Bootstrap image mirrored (`ghcr.io/clarity-tech/invoicing:latest` →
      `…/docker/invoicing:bootstrap`, `linux/amd64` confirmed) so the jobs could be
      created. CI replaces it with SHA-tagged images on each deploy.
- [x] **D10** Cloud Run jobs created: `invoicing-migrate` (no retries, 600s),
      `invoicing-prune`, `invoicing-exchange-rates`
- [x] **D11** Cloud Scheduler: `invoicing-exchange-rates-daily` (02:00 UTC) and
      `invoicing-prune-daily` (03:00 UTC), both ENABLED.
      Verified these are exact equivalents of `routes/console.php:12-13` —
      `config/app.php:68` hardcodes the app timezone to UTC, so Laravel's
      `dailyAt('03:00')` was already UTC.
      `run.invoker` granted **per-job**, not project-wide, so this identity still
      cannot invoke `invoicing-worker`.
- [ ] **D8** Set the GitHub repository variables the deploy job reads —
      `GCP_PROJECT`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`,
      `GCP_DB_HOST`, `GCP_DB_NAME`, `GCP_DB_USER`, `GCP_AWS_KEY_ID`,
      `GCP_AWS_REGION`, `GCP_AWS_BUCKET`, `GCP_AWS_URL`, `GCP_MAIL_HOST`,
      `GCP_MAIL_PORT`, `GCP_MAIL_USER`, `GCP_MAIL_FROM`.
      The deploy fails fast if any leaves a `__TOKEN__` unsubstituted.
      *(Only needed for CI — the manual deploy uses `deploy/cloudrun/deploy.env`.)*
- [x] **D12** Manifests completed with the S3 and SMTP blocks (`AWS_ACCESS_KEY_ID`,
      `AWS_DEFAULT_REGION`, `AWS_BUCKET`, `AWS_URL`, `MAIL_MAILER/HOST/PORT/
      USERNAME/FROM_ADDRESS`) — env var names read from `config/filesystems.php`
      and `config/mail.php` rather than assumed. AWS S3 proper, so `AWS_ENDPOINT`
      stays unset and path-style addressing stays off.
- [x] **D13** Added `deploy/cloudrun/render.sh` + `deploy.env.example`, and
      gitignored `deploy.env`. Non-secret config (hostnames, access key id, SMTP
      user) is substituted from a local file rather than committed or pasted into
      chat; genuine secrets stay in Secret Manager. Verified both paths: exits 78
      listing every missing value, and renders both manifests with zero tokens
      left. CI substitutes the same token set from repository variables.
- [x] **D14** Cloud Build enabled and an amd64 image built. `--tag` shorthand needs
      a root `Dockerfile`, so a config file in the scratchpad points at
      `docker/production/Dockerfile.frankenphp --target production`. The project has
      no legacy Cloud Build SA, so the build runs as the Compute default SA with
      `logging.logWriter`, `artifactregistry.writer` and `storage.objectUser`.
      Built on GCP rather than locally because this Mac is arm64 and Cloud Run
      needs amd64 — QEMU emulation would have been far slower.
- [ ] **D7** Point `invoiceink.claritytech.io` at the web service via **Cloudflare**
      *(plan §9.4)* — no GCP load balancer, so no always-on cost. Three steps:
      proxied `CNAME invoiceink → invoicing-web-<hash>.asia-south1.run.app`;
      an Origin Rule overriding the `Host` header to the `.run.app` hostname
      (mandatory — Cloud Run rejects mismatched hosts); SSL/TLS mode
      **Full (strict)** (Flexible cannot work — Cloud Run is HTTPS-only, and it
      would loop against `OCTANE_HTTPS=true`).
      Accepted trade-off: the `.run.app` URL remains publicly reachable.

### Manual first deploy — blocked

Decided: deploy worker first, then web (mirrors what CI does, so it validates that
sequence too).

- [x] **M1** amd64 image built and pushed —
      `asia-south1-docker.pkg.dev/invoiceink/docker/invoicing:manual-403fbd47`
      (`sha256:5245696c…`), Cloud Build SUCCESS in 5m18s.
      Tagged from commit `403fbd47`, but **built from the working tree, which has
      uncommitted Phase A–C changes** — so the tag understates what is in it.
- [!] **M2** Populate `deploy/cloudrun/deploy.env` — the file exists but only
      carries the example defaults (`PROJECT`, `REGION`, `TAG`, `MAIL_PORT`).
      Still empty: `DB_HOST`, `DB_NAME`, `DB_USER`, `AWS_KEY_ID`, `AWS_REGION`,
      `AWS_BUCKET`, `AWS_URL`, `MAIL_HOST`, `MAIL_USER`, `MAIL_FROM`.
- [!] **M3** Add Secret Manager versions — all four secrets currently have
      **0 versions**. The manifests reference them via `secretKeyRef`, so a deploy
      fails until each has a value.
- [x] **M4** Both services deployed.
      `https://invoicing-web-823788548123.asia-south1.run.app`
      `https://invoicing-worker-823788548123.asia-south1.run.app`
- [x] **M5** IAM applied and verified: worker grants `run.invoker` to
      `invoicing-tasks-invoker` **only** (no `allUsers`); web grants `allUsers`.
- [x] **M6** Security invariants verified against the live deployment:
      | check | result |
      |---|---|
      | web `/up` | 200 |
      | web `POST /handle-task` | **404** — route absent on the public service |
      | worker unauthenticated | **403** — rejected by Cloud Run's front end |
      | worker with ID token | 200 |
      | worker `POST /handle-task` authed | **422** — route present, rejecting malformed JSON exactly as `TaskHandler` does |
      The §5.3 split works end to end on the real deployment.
- [x] **M7** Boot sequence confirmed from logs: `config:cache` ✅, `route:cache` ✅
      (runtime, per the §7.1.1 fix), OPcache enabled, startup probe passed,
      and the `sh -c … --port=${PORT:-8080}` CMD visible and working.
- [!] **M8** **App returns 500 — database authentication fails.** Three bugs found,
      two fixed:
      1. *Fixed:* manifests hardcoded `DB_PORT: "3306"`. This is DigitalOcean
         managed MySQL, which listens on **25060**. Symptom was a 60s PDO timeout
         (which also proved `OCTANE_MAX_EXECUTION_TIME=60` works). `DB_PORT` and
         `MYSQL_ATTR_SSL_CA` are now tokens; the latter is droppable.
      2. *Not a bug, confirmed:* DO requires TLS —
         `caching_sha2_password reported error: Authentication requires secure
         connection` when SSL is disabled. PHP negotiates TLS automatically
         (it reached auth and returned 1045, not 2061), so `DB_SSL_CA` can stay
         blank.
      3. **Outstanding: the `DB_PASSWORD` secret value is wrong.** Verified by
         connecting directly with the stored secret over TLS from a second
         machine — same `Access denied for user … (using password: YES)`. Two
         different source IPs, same rejection, so it is the credential and not a
         firewall or host grant. The stored value is byte-clean (22 bytes, no
         trailing newline, CR, space or quote), so it was stored correctly — it
         simply is not this user's password.
- [x] **M9** `DB_PASSWORD` v2 added by the user and verified against the database
      directly before redeploying (`SELECT 1` over TLS → `invoicing`, MySQL 8.0.45).
- [x] **M10** **Fourth bug: the redeploy created no new revision.**
      `gcloud run services replace` is declarative — a byte-identical spec is a
      no-op, so revision `00002` (created *before* the secret was rotated) kept
      serving. `secretKeyRef` with `key: latest` resolves when a revision's
      instances start, so this fails **silently**: correct secret, correct
      manifest, stale value, no error anywhere.
      Fixed in `render.sh`, which now stamps the revision template with
      `invoiceink.claritytech.io/rendered-at`, guaranteeing every render is a
      distinct spec. CI was already immune (the image tag changes per commit),
      but manual redeploys and secret rotation were not.
- [x] **M11** **Application verified live.**
      | path | result |
      |---|---|
      | `/up` | 200 (0.13s) |
      | `/` | 200 (0.76s) |
      | `/login` | 200 (0.28s) |
      | `/register` | 200 (0.23s) |
      `<title>InvoiceInk</title>` confirms the `VITE_APP_NAME` fix (A1/A2) shipped;
      Inertia's `data-page` payload is present, so the Vue app is mounting.
      Security invariants re-checked and unchanged.
- [x] **M12** **Migration job is not needed.** Compared `migrations` in the live
      database against `database/migrations/`: 38 applied, 37 in repo,
      **zero pending**. The one extra row is
      `2025_07_08_194821_create_customer_contacts_table`, whose file was removed in
      commit `403fbd47` ("drop the unused customer_contacts table") — expected, not
      drift. So the risky step is moot: there is nothing to migrate.

> **Not run, and will not be without an explicit go-ahead:** the `invoicing-migrate`
> job points at the **production database the VPS is currently serving from**.
> Running it would alter live data underneath the running application.

### Live verification — 2026-08-01

**Domain is live.** `https://invoiceink.claritytech.io` serves through a Cloudflare
Worker (`invoiceink-proxy`, version `856720e8`), bound to
`invoiceink.claritytech.io/*` only.

| Area | Check | Result |
|---|---|---|
| Web | `/up`, `/`, `/login`, `/register` | 200 |
| Web | `/invoices` unauthenticated | 302 → `https://invoiceink.claritytech.io/login` |
| Web | `<title>` | `InvoiceInk` — confirms the A1/A2 `VITE_APP_NAME` fix |
| Web | Inertia `data-page` | present, Vue mounts |
| Web | `/build/assets/*.css` and `*.js` | 200, resolve to the public domain |
| Web | `POST /login` | 419 CSRF — method and body proxy correctly |
| Security | `POST /handle-task` on web | **404** — route absent on the public service |
| Security | worker unauthenticated | **403** — rejected at Cloud Run's edge |
| Security | worker with ID token | 200 |
| Security | worker IAM policy | `invoicing-tasks-invoker` only, no `allUsers` |
| Jobs | `invoicing-migrate` | SUCCEEDED — *"Nothing to migrate"* |
| Jobs | `invoicing-prune` | SUCCEEDED — *"Pruned 2 expired email attachment(s)"*, proving S3 access |
| Jobs | `invoicing-exchange-rates` | SUCCEEDED — 9 currencies written for 2026-08-01 |
| Scheduler | both entries force-triggered | executions created and SUCCEEDED |
| Queue | Cloud Tasks → worker, OIDC as the invoker SA | **200** logged, `userAgent: Google-Cloud-Tasks` |
| Queue | Cloud Tasks → `POST /handle-task` | delivered; 500 only because the probe body was not a Laravel payload (`Undefined array key "data"` at `IncomingTask.php:100`) |

**Bug found and fixed during verification: the Cloud Run jobs had no environment
at all.** They were created with only an image and service account, so they fell
back to Laravel's defaults and tried `127.0.0.1:3306`, database `laravel`. The
exchange-rates job still proved outbound egress worked — it fetched live rates
before failing to store them. Fixed by adding `deploy/cloudrun/update-jobs.sh`,
which derives the job environment from the rendered worker manifest so the two
cannot drift. Its first version used `^@^` as gcloud's list delimiter, which
corrupted the three values that contain `@` (service account, SMTP username,
from-address); it now uses `^|^`.

**Not a bug, ruled out:** `CLOUD_TASKS_HANDLER` uses the `status.url` hostname
form (`…-6oxcvdd6ea-el.a.run.app`) rather than the canonical
`…-823788548123.asia-south1.run.app`. Both were tested and both accept an OIDC
token and return 200.

- [!] **V1 Remaining: the `DocumentMailer` path is untested** — Cloud Tasks →
      worker → two Gotenberg renders → SMTP. It is the only queued job in the
      application (both media conversions are `nonQueued()`,
      `Organization.php:500,505`), so exercising the queue with a real payload
      requires creating an invoice and sending an actual email. Needs the user's
      go-ahead because it sends outbound mail.

## Phase E — Cutover

Owner: **user**. Plan §15.

- [ ] **E1** Confirm the VPS deploy still works with `AUTORUN_LARAVEL_MIGRATION=true`
      set in `app.env` *(the one Phase A change that affects the VPS)*
- [ ] **E2** Deploy both services with `QUEUE_CONNECTION=sync` — smoke test avoiding
      PDF-attached email *(see plan §15 step 4 caveat)*
- [ ] **E3** Flip to `cloudtasks`, send a test invoice
- [ ] **E4** Verify an unauthenticated `curl` to the worker is rejected
- [ ] **E5** Verify `/handle-task` 404s on the public web service
- [ ] **E6** Point `invoiceink.claritytech.io` at the web service
- [ ] **E7** Decommission the VPS after a week of parallel running

---

## Log

Newest last.

- **2026-08-01** — TODO file created. Starting Phase A.
- **2026-08-01** — Phase A complete (A1–A11).
  - Verified before baking `route:cache`: `routes/api.php:6` and `routes/web.php:23`
    do use action closures, but Laravel 13 serialises them via
    `SerializableClosure::unsigned()` (`Route::prepareForSerialization`,
    `vendor/.../Routing/Route.php:1544`), so caching them is safe. The group
    closures at `web.php:37,43,76` are not route actions and never mattered.
  - Bug found and fixed in my own §14 deploy step: `CLOUD_TASKS_HANDLER` needs the
    worker's URL, which Cloud Run only assigns once the service exists —
    chicken-and-egg on first deploy. Both YAMLs now use a `WORKER_URL` placeholder
    and the workflow bootstraps the worker once, reads back `status.url`, then
    renders both services with the real value.
  - Deploy order changed to worker-then-web so the handler exists before the
    public service can enqueue to it.
- **2026-08-01** — Starting Phase C1 (image build) ahead of Phase B, since it
  validates the riskiest changes (A3–A5).
- **2026-08-01** — Phase B complete. **Serious flaw found in my own A3 change while
  verifying the package, and fixed.**
  - A3 originally baked `route:cache` at build time. The Cloud Tasks package
    registers `POST /handle-task` conditionally on
    `cloud-tasks.disable_task_handler` (`CloudTasksServiceProvider::registerRoutes()`,
    verified in installed v6). At build time that env var is unset → defaults to
    `false` → the handler was compiled **into the cached route file**. At runtime
    the web service sets it to `true`, but that only makes `registerRoutes()`
    return early; Laravel loads the compiled routes rather than re-evaluating.
    The task handler would have been live on the **public** service, defeating the
    entire §5.3 two-service security split.
  - Fix: `route:cache` moved back to container start
    (`AUTORUN_LARAVEL_ROUTE_CACHE=true`). `view:cache` and `event:cache` stay baked
    — neither depends on the environment. Plan §7.1.1 records the general rule.
  - Verified empirically in C2, both directions.
- **2026-08-01** — Phase C: C1–C4 pass. First full-suite attempt died on the host
  `php.ini` `memory_limit=128M` during `akaunting/laravel-money` bootstrap — an
  environment limit, not a code failure. Re-run with `-d memory_limit=2G`.
- **2026-08-01** — Note: `composer require` triggered the `boost:update` script,
  which touched `boost.json` and `.agents/skills/pest-testing/SKILL.md`. Both were
  already modified before this work started; flagging so the changes aren't
  mistaken for part of this migration.
- **2026-08-01** — Two more deploy bugs found and fixed during review:
  - The `sed` render used bare tokens, so `s|PROJECT|…|g` also rewrote the env var
    **name** `CLOUD_TASKS_PROJECT` into `CLOUD_TASKS_<project-id>`. All placeholders
    are now `__WRAPPED__` and cannot collide with variable names.
  - `EXTERNAL_DB_HOST` was a placeholder nothing substituted, and `DB_DATABASE` /
    `DB_USERNAME` were invented values. They are now `__DB_HOST__` / `__DB_NAME__` /
    `__DB_USER__` fed from GitHub repository variables (D8), and the deploy step
    asserts no `__TOKEN__` survives rendering rather than shipping a literal
    string as a hostname.
  - Plan §9.1/§9.2 no longer duplicates the YAML — it points at
    `deploy/cloudrun/*.yaml` so the doc cannot drift from what deploys.
  - Plan §6.1 B6 contradicted the new §7.1.1 (it still said route cache was safe
    to bake); corrected.
- **2026-08-01** — **Phases A–C complete.** All repo-side work is done, verified and
  formatted. Nothing committed. Phases D and E require GCP credentials.
- **2026-08-01** — Phase D started. `google-cloud-sdk` installed via Homebrew
  (`/opt/homebrew/bin/gcloud`). Awaiting `gcloud auth login` (interactive, user-run)
  plus the target project id and region.
- **2026-08-01** — **Cloud Run domain mapping is unavailable in both Indian
  regions** — it exists in only nine, and neither `asia-south1` (Mumbai) nor
  `asia-south2` (Delhi) is one. Initially this meant a mandatory GCP external load
  balancer, whose forwarding rule and static IP would have been the one always-on
  cost in a design premised on having none.
  - Resolved better once the user mentioned the domain is already on **Cloudflare**:
    a proxied CNAME plus an Origin Rule Host-header override reaches Cloud Run
    directly, at no additional cost, and brings Cloudflare's TLS, CDN and WAF.
  - Trade-off accepted by the user: the `.run.app` URL stays publicly reachable, so
    a determined party could bypass Cloudflare. Two escalation paths recorded in
    plan §9.4 if that ever matters.
  - No application changes needed — `APP_URL` is already pinned to the public
    domain on both services, `trustProxies` is `*`, and session cookies carry no
    `Domain` attribute.
- **2026-08-01** — Region decided: **`asia-south1`** (Mumbai, Tier 1). Plan §4
  diagram and §9.4 rewritten for the Cloudflare path.
- **2026-08-01** — Caveat for the user: `composer require`, `pint` and the tests ran
  on **host PHP 8.5.6**, not through Sail as CLAUDE.md specifies (Sail was not
  running). `composer.json` declares no `ext-*` requirements so the lock should
  match, but the host lacks `ext-redis` and `vendor/` was previously built in the
  container. Worth a confirming `sail composer install` before deploying.
