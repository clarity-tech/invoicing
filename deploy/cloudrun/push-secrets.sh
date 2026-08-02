#!/usr/bin/env bash
#
# Copy the four secret values out of an existing Laravel env file into Google
# Secret Manager, creating a new version of each.
#
# Nothing is printed except the variable name and the length of its value, so the
# secrets stay out of terminal scrollback and transcripts.
#
# Usage:
#   ./deploy/cloudrun/push-secrets.sh /path/to/app.env
#   ./deploy/cloudrun/push-secrets.sh /path/to/app.env --dry-run
#
# Values are written with printf, never echo: a trailing newline on APP_KEY
# produces decryption failures that look like data corruption.

set -euo pipefail

PROJECT="${PROJECT:-invoiceink}"
SECRETS=(APP_KEY DB_PASSWORD MAIL_PASSWORD AWS_SECRET_ACCESS_KEY)

src="${1:-}"
dry_run=false
[[ "${2:-}" == "--dry-run" ]] && dry_run=true

if [[ -z "$src" ]]; then
    echo "usage: $(basename "$0") /path/to/app.env [--dry-run]" >&2
    exit 64
fi
[[ -f "$src" ]] || { echo "no such file: $src" >&2; exit 66; }

# Read KEY=VALUE without sourcing — the file is not ours and may contain anything.
read_env() {
    local key="$1" line value
    line="$(grep -E "^[[:space:]]*${key}=" "$src" | tail -n 1 || true)"
    [[ -z "$line" ]] && return 1
    value="${line#*=}"
    value="${value%$'\r'}"                       # strip CRLF endings
    value="$(sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' <<<"$value")"
    # Strip one layer of matching quotes, if present.
    if [[ "$value" == \"*\" || "$value" == \'*\' ]]; then
        value="${value:1:${#value}-2}"
    fi
    printf '%s' "$value"
}

failed=0
for name in "${SECRETS[@]}"; do
    if ! value="$(read_env "$name")" || [[ -z "$value" ]]; then
        printf '  %-24s NOT FOUND in %s — skipping\n' "$name" "$src" >&2
        failed=1
        continue
    fi

    if $dry_run; then
        printf '  %-24s would add version (%d chars)\n' "$name" "${#value}"
        continue
    fi

    printf '%s' "$value" | gcloud secrets versions add "$name" \
        --data-file=- --project="$PROJECT" >/dev/null
    printf '  %-24s version added (%d chars)\n' "$name" "${#value}"
done

if (( failed )); then
    echo >&2
    echo "One or more values were missing. Add them by hand with:" >&2
    echo "  printf '%s' 'VALUE' | gcloud secrets versions add NAME --data-file=- --project=$PROJECT" >&2
    exit 65
fi
