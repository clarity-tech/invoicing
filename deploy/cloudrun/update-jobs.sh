#!/usr/bin/env bash
#
# Apply a service's environment to the Cloud Run jobs that run alongside it.
#
# The jobs run the same application as the services and need the same database,
# storage and mail configuration. Rather than maintaining a second copy of that
# list, this derives it from a rendered service manifest — so a variable added
# to worker.yaml reaches the jobs automatically and the two cannot drift.
#
# Usage:
#   ./deploy/cloudrun/update-jobs.sh                         # production jobs
#   ./deploy/cloudrun/update-jobs.sh --service mcp-staging   # the staging job
#   ./deploy/cloudrun/update-jobs.sh --dry-run               # print, apply nothing
#
# Values come from deploy.env (see render.sh); secrets stay in Secret Manager and
# are passed by reference, never read here.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Which jobs belong to which service. Deliberately a fixed mapping rather than a
# free-form --jobs list: the production deploy migrates *before* it re-syncs job
# environment, so a job list given by mistake could point invoicing-migrate at
# the staging schema and the next production deploy would then migrate staging
# and serve an un-migrated production.
jobs_for_service() {
    case "$1" in
        worker)      echo "invoicing-migrate invoicing-prune invoicing-exchange-rates" ;;
        mcp-staging) echo "invoicing-migrate-staging" ;;
        *)           return 1 ;;
    esac
}

service=worker
dry_run=false

while (( $# )); do
    case "$1" in
        --dry-run) dry_run=true; shift ;;
        --service) service="${2:-}"; shift 2 ;;
        --service=*) service="${1#*=}"; shift ;;
        *) echo "usage: $(basename "$0") [--service {worker|mcp-staging}] [--dry-run]" >&2; exit 64 ;;
    esac
done

# Tested on the function, not on `read`: a here-string always yields a line, so
# `read` would succeed even for an unknown service and leave JOBS empty.
if ! job_list="$(jobs_for_service "$service")"; then
    echo "no jobs are defined for service '$service'" >&2
    echo "usage: $(basename "$0") [--service {worker|mcp-staging}] [--dry-run]" >&2
    exit 64
fi
read -r -a JOBS <<<"$job_list"

ENV_FILE="${DEPLOY_ENV_FILE:-$HERE/deploy.env}"
if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; source "$ENV_FILE"; set +a
fi
# CI has no deploy.env and supplies these as environment variables instead.
: "${PROJECT:?PROJECT must be set (deploy.env or environment)}"
: "${REGION:?REGION must be set (deploy.env or environment)}"

# WORKER_URL only matters to the HTTP services, but render.sh requires every
# token to resolve. Jobs never receive a Cloud Tasks request.
rendered="$(WORKER_URL="${WORKER_URL:-https://placeholder.invalid}" "$HERE/render.sh" "$service" 2>/dev/null)"

# Split the manifest's env into plain values and secret references.
# gcloud's ^|^ prefix switches the list delimiter from comma to a pipe. A pipe is
# used rather than the more common @ because several values contain one: the
# Cloud Tasks service account, the SMTP username and the from-address.
read -r -d '' RUBY <<'EOF' || true
require "yaml"
doc = YAML.load(STDIN.read)
env = doc["spec"]["template"]["spec"]["containers"][0]["env"]

# These describe a sidecar or an HTTP listener that jobs do not have. None of
# these jobs render PDFs or serve requests; carrying a misleading value helps
# nobody.
skip = %w[GOTENBERG_ENABLED GOTENBERG_URL GOTENBERG_TIMEOUT CLOUD_TASKS_DISABLE_TASK_HANDLER]

plain = env.reject { |e| e["valueFrom"] || skip.include?(e["name"]) }
           .map { |e| "#{e["name"]}=#{e["value"]}" }
secret = env.select { |e| e["valueFrom"] }
            .map { |e| "#{e["name"]}=#{e.dig("valueFrom","secretKeyRef","name")}:latest" }

puts "^|^" + plain.join("|")
puts "^|^" + secret.join("|")
EOF

mapfile -t parts < <(printf '%s' "$rendered" | ruby -e "$RUBY")
ENV_ARG="${parts[0]}"
SECRET_ARG="${parts[1]}"

echo "env vars:  $(tr "|" "\n" <<<"${ENV_ARG#^|^}" | wc -l | tr -d ' ') values"
echo "secrets:   $(tr "|" "\n" <<<"${SECRET_ARG#^|^}" | wc -l | tr -d ' ') references"

if $dry_run; then
    echo
    echo "--- plain (values hidden) ---"
    tr "|" "\n" <<<"${ENV_ARG#^|^}" | cut -d= -f1 | sed 's/^/    /'
    echo "--- secret refs ---"
    tr "|" "\n" <<<"${SECRET_ARG#^|^}" | sed 's/^/    /'
    exit 0
fi

for job in "${JOBS[@]}"; do
    gcloud run jobs update "$job" \
        --region="$REGION" --project="$PROJECT" \
        --set-env-vars="$ENV_ARG" \
        --set-secrets="$SECRET_ARG" \
        --quiet >/dev/null
    echo "  updated $job"
done
