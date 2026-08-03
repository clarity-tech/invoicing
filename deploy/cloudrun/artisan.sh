#!/usr/bin/env bash
#
# Run an arbitrary artisan command against the production Cloud Run environment.
#
# It works by executing an existing Cloud Run Job with its arguments overridden.
# The job already carries the full production environment and Secret Manager
# references (see update-jobs.sh), so the command sees the same database, S3
# bucket and mail configuration the running services do.
#
# Usage:
#   ./deploy/cloudrun/artisan.sh migrate:status
#   ./deploy/cloudrun/artisan.sh db:seed --class=ProductionUserSeeder --force
#   ./deploy/cloudrun/artisan.sh "invoices:something --flag=a,b"
#
#   ./deploy/cloudrun/artisan.sh --logs migrate:status   # also tail the output
#
# Notes:
#   - Jobs have NO Gotenberg sidecar, so anything that renders a PDF will fail.
#     Use the worker service for that (it is what the queue already does).
#   - Commands are non-interactive: any confirm() prompt takes its default,
#     which for ProductionSeeder means "no". Call the sub-seeders directly.
#   - Default task timeout is whatever the job was created with (600s).

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${DEPLOY_ENV_FILE:-$HERE/deploy.env}"
[[ -f "$ENV_FILE" ]] && { set -a; source "$ENV_FILE"; set +a; }

PROJECT="${PROJECT:-invoiceink}"
REGION="${REGION:-asia-south1}"
# Any job works; this one is a plain runner whose own args we replace.
RUNNER_JOB="${RUNNER_JOB:-invoicing-migrate}"

show_logs=false
if [[ "${1:-}" == "--logs" ]]; then show_logs=true; shift; fi

if [[ $# -eq 0 ]]; then
    echo "usage: $(basename "$0") [--logs] <artisan command and arguments>" >&2
    echo "example: $(basename "$0") --logs migrate:status" >&2
    exit 64
fi

# gcloud splits --args on commas by default, which mangles anything containing
# one. The ^|^ prefix switches the delimiter to a pipe.
args="artisan"
for a in "$@"; do
    args+="|$a"
done

echo "→ php $(printf '%s ' "artisan" "$@")"
echo "  job=$RUNNER_JOB region=$REGION project=$PROJECT"
echo

gcloud run jobs execute "$RUNNER_JOB" \
    --region="$REGION" --project="$PROJECT" \
    --args="^|^$args" \
    --wait

if $show_logs; then
    echo
    echo "--- output ---"
    gcloud logging read \
        "resource.type=cloud_run_job AND resource.labels.job_name=$RUNNER_JOB" \
        --project="$PROJECT" --limit=40 --freshness=5m \
        --format='value(textPayload)' \
        | grep -v '^[[:space:]]*$' \
        | tac
fi
