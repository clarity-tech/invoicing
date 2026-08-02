#!/usr/bin/env bash
#
# Render a Cloud Run manifest by substituting its __TOKEN__ placeholders.
#
# Values come from deploy/cloudrun/deploy.env, which is gitignored — the point is
# that hostnames, access key ids and SMTP usernames never land in the repository.
# Genuine secrets (APP_KEY, DB_PASSWORD, MAIL_PASSWORD, AWS_SECRET_ACCESS_KEY) are
# not here at all; the manifests pull those from Secret Manager via secretKeyRef.
#
# Each __FOO_BAR__ token maps to the environment variable FOO_BAR.
#
# Usage:
#   ./deploy/cloudrun/render.sh worker > /tmp/worker.yaml
#   WORKER_URL=https://… ./deploy/cloudrun/render.sh web > /tmp/web.yaml
#
# Variables already set in the environment win over deploy.env, so WORKER_URL can
# be supplied at the point of use.
#
# CI does not use this script — the GitHub workflow substitutes the same tokens
# from repository variables. Keep the two token sets in sync.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${DEPLOY_ENV_FILE:-$HERE/deploy.env}"

# Tokens that may legitimately be blank. Their env entry is dropped from the
# manifest entirely rather than rendered as "", because Laravel distinguishes
# unset from empty: config/filesystems.php falls back to the SDK's generated
# bucket URL when AWS_URL is absent, but an empty string would be used verbatim.
OPTIONAL_TOKENS=(AWS_URL DB_SSL_CA)

service="${1:-}"
if [[ "$service" != "web" && "$service" != "worker" ]]; then
    echo "usage: $(basename "$0") {web|worker}" >&2
    exit 64
fi

manifest="$HERE/$service.yaml"
[[ -f "$manifest" ]] || { echo "no such manifest: $manifest" >&2; exit 66; }

mapfile -t tokens < <(grep -o '__[A-Z0-9_]*__' "$manifest" | sort -u)

# Remember which values arrived from the caller so deploy.env cannot clobber them.
declare -A preset=()
for token in "${tokens[@]}"; do
    var="${token//__/}"
    [[ -n "${!var:-}" ]] && preset["$var"]="${!var}"
done

if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; source "$ENV_FILE"; set +a
else
    echo "warning: $ENV_FILE not found, relying on the ambient environment" >&2
fi

for var in "${!preset[@]}"; do
    printf -v "$var" '%s' "${preset[$var]}"
done

is_optional() {
    local needle="$1"
    for t in "${OPTIONAL_TOKENS[@]}"; do [[ "$t" == "$needle" ]] && return 0; done
    return 1
}

content="$(cat "$manifest")"
missing=()
dropped=()

for token in "${tokens[@]}"; do
    var="${token//__/}"
    value="${!var:-}"

    if [[ -z "$value" ]]; then
        if is_optional "$var"; then
            # Drop the "- name: X" / "value: __TOKEN__" pair for this entry.
            content="$(awk -v tok="$token" '
                { lines[NR] = $0 }
                END {
                    for (i = 1; i <= NR; i++) {
                        if (lines[i] ~ ("value: \"?" tok "\"?[[:space:]]*$")) {
                            for (j = i - 1; j >= 1; j--) {
                                if (lines[j] ~ /^[[:space:]]*- name:/) { skip[j] = 1; break }
                                if (lines[j] !~ /^[[:space:]]*#/ && lines[j] !~ /^[[:space:]]*$/) break
                            }
                            skip[i] = 1
                        }
                    }
                    for (i = 1; i <= NR; i++) if (!(i in skip)) print lines[i]
                }' <<<"$content")"
            dropped+=("$var")
            continue
        fi
        missing+=("$var")
        continue
    fi

    content="${content//$token/$value}"
done

if (( ${#missing[@]} )); then
    echo "unset values for: ${missing[*]}" >&2
    echo "set them in $ENV_FILE (see deploy.env.example)" >&2
    exit 78
fi

(( ${#dropped[@]} )) && echo "note: omitted optional env entries: ${dropped[*]}" >&2

# Belt and braces: never emit a manifest still carrying a placeholder.
if grep -q '__[A-Z0-9_]*__' <<<"$content"; then
    echo "internal error: placeholders survived substitution:" >&2
    grep -o '__[A-Z0-9_]*__' <<<"$content" | sort -u >&2
    exit 70
fi

# Stamp the revision template so every render produces a distinct spec.
#
# "gcloud run services replace" is declarative: an unchanged spec creates no new
# revision. That silently breaks secret rotation, because secretKeyRef entries
# using "latest" are resolved when a revision's instances start — so redeploying
# after adding a new secret version would keep serving the old value with no
# error and no clue. Deploys are explicit acts; make them always produce one.
stamp="${RENDER_STAMP:-$(date -u +%Y%m%dT%H%M%SZ)}"
content="$(awk -v stamp="$stamp" '
    !done && /^      annotations:$/ {
        print
        print "        invoiceink.claritytech.io/rendered-at: \"" stamp "\""
        done = 1
        next
    }
    { print }
' <<<"$content")"

printf '%s\n' "$content"
