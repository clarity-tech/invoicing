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

# Capture the execution name so logs can be filtered to this run alone. Without
# it, concurrent or recent runs of the same job bleed into the output.
#
# Started without --wait so the execution name is captured up front. With
# --wait, a failing job exits non-zero and prints no name, which is precisely
# when the logs matter most -- and without a name the log filter falls back to
# the whole job and shows output from earlier, unrelated runs.
execution="$(gcloud run jobs execute "$RUNNER_JOB" \
    --region="$REGION" --project="$PROJECT" \
    --args="^|^$args" \
    --format='value(metadata.name)' 2>/dev/null | tail -n 1)"

if [[ -z "$execution" ]]; then
    echo "failed to start an execution of $RUNNER_JOB" >&2
    exit 70
fi

echo "  execution=$execution"
echo -n "  waiting"

# Fields are queried one at a time. A multi-field value() cannot be parsed
# reliably: gcloud separates with tabs and emits an empty leading field when
# succeededCount is unset, but tab is IFS whitespace, so `read` strips it as
# padding and every value lands in the wrong variable.
describe_field() {
    gcloud run jobs executions describe "$execution" \
        --region="$REGION" --project="$PROJECT" \
        --format="value($1)" 2>/dev/null | tr -d '[:space:]'
}

status=1
for _ in $(seq 1 120); do   # ~20 minutes, matching the job's task timeout
    if [[ -n "$(describe_field status.completionTime)" ]]; then
        [[ "$(describe_field status.succeededCount)" == "1" ]] && status=0 || status=1
        break
    fi
    echo -n "."
    sleep 10
done
echo

if [[ $status -eq 0 ]]; then
    echo "  SUCCEEDED"
else
    echo "  FAILED"
fi

if $show_logs; then
    echo
    echo "--- output ---"

    if [[ -n "$execution" ]]; then
        filter="resource.type=cloud_run_job AND labels.\"run.googleapis.com/execution_name\"=\"$execution\""
    else
        # Fall back to the job name if the execution name could not be read.
        filter="resource.type=cloud_run_job AND resource.labels.job_name=\"$RUNNER_JOB\""
    fi

    # Cloud Logging ingests asynchronously, so entries can lag the job finishing
    # by a few seconds. Poll until something arrives rather than printing an
    # empty block, which previously made a successful command look like it had
    # produced no output at all.
    err_file="$(mktemp)"
    for attempt in 1 2 3 4 5 6 7 8 9 10; do
        out="$(gcloud logging read "$filter" \
            --project="$PROJECT" --limit=1000 --freshness=1h \
            --format='value(textPayload)' 2>"$err_file" \
            | grep -v '^[[:space:]]*$' || true)"

        [[ -n "$out" ]] && break
        sleep 3
    done

    if [[ -z "$out" ]]; then
        # Distinguish "the command printed nothing" from "we could not read the
        # logs". They look identical otherwise, and the second is usually a
        # missing roles/logging.viewer on whichever identity is running -- which
        # silently turned every CI run's output into an empty block.
        if [[ -s "$err_file" ]]; then
            echo "could not read logs:" >&2
            sed 's/^/  /' "$err_file" >&2
            echo "(log read failed — see stderr; the command itself reported ${status})"
        else
            echo "(no output captured — the command may have written nothing to stdout)"
        fi
    else
        # Cloud Logging returns newest-first; reverse so it reads in the order it
        # was produced. awk rather than tac, which is absent on macOS.
        awk '{ line[NR] = $0 } END { for (i = NR; i > 0; i--) print line[i] }' <<<"$out"
    fi
fi

exit "$status"
