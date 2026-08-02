#!/usr/bin/env bash
#
# Apply the worker service's environment to the Cloud Run jobs.
#
# The jobs run the same application as the services and need the same database,
# storage and mail configuration. Rather than maintaining a second copy of that
# list, this derives it from the rendered worker manifest — so a variable added
# to worker.yaml reaches the jobs automatically and the two cannot drift.
#
# Usage:
#   ./deploy/cloudrun/update-jobs.sh            # apply
#   ./deploy/cloudrun/update-jobs.sh --dry-run  # print what would be applied
#
# Values come from deploy.env (see render.sh); secrets stay in Secret Manager and
# are passed by reference, never read here.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JOBS=(invoicing-migrate invoicing-prune invoicing-exchange-rates)

dry_run=false
[[ "${1:-}" == "--dry-run" ]] && dry_run=true

# shellcheck disable=SC1091
set -a; source "$HERE/deploy.env"; set +a
: "${PROJECT:?PROJECT must be set in deploy.env}"
: "${REGION:?REGION must be set in deploy.env}"

# WORKER_URL only matters to the HTTP services, but render.sh requires every
# token to resolve. Jobs never receive a Cloud Tasks request.
rendered="$(WORKER_URL="${WORKER_URL:-https://placeholder.invalid}" "$HERE/render.sh" worker 2>/dev/null)"

# Split the manifest's env into plain values and secret references.
# gcloud's ^|^ prefix switches the list delimiter from comma to a pipe. A pipe is
# used rather than the more common @ because several values contain one: the
# Cloud Tasks service account, the SMTP username and the from-address.
read -r -d '' RUBY <<'EOF' || true
require "yaml"
doc = YAML.load(STDIN.read)
env = doc["spec"]["template"]["spec"]["containers"][0]["env"]

# GOTENBERG_URL points at a sidecar that jobs do not have. None of these jobs
# render PDFs; carrying a misleading value helps nobody.
skip = %w[GOTENBERG_URL GOTENBERG_TIMEOUT CLOUD_TASKS_DISABLE_TASK_HANDLER]

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
