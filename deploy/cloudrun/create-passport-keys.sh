#!/usr/bin/env bash
#
# Generate the RSA key pair Passport signs MCP OAuth tokens with, and store it
# in Secret Manager as PASSPORT_PRIVATE_KEY / PASSPORT_PUBLIC_KEY (or their
# _STAGING twins). web.yaml and mcp-staging.yaml read them from there.
#
# Run it once per environment, BEFORE deploying a manifest that references the
# secrets: Cloud Run refuses a revision whose secret does not exist, so the
# deploy would fail rather than serve.
#
# Usage:
#   ./deploy/cloudrun/create-passport-keys.sh             # production
#   ./deploy/cloudrun/create-passport-keys.sh --staging   # invoicing-mcp-staging
#   ./deploy/cloudrun/create-passport-keys.sh --rotate    # replace an existing pair
#
# The pair is generated here, rather than per container with passport:keys,
# because every instance must verify tokens the others signed. Rotating it
# invalidates every issued token, so each connected Claude has to sign in again;
# that is why an existing pair is left alone unless --rotate is given.
#
# The key never touches the terminal or the working tree: it is written to a
# private temporary directory that is removed on exit.

set -euo pipefail

PROJECT="${PROJECT:-invoiceink}"
suffix=""
rotate=false

for arg in "$@"; do
    case "$arg" in
        --staging) suffix="_STAGING" ;;
        --rotate) rotate=true ;;
        *) echo "usage: $(basename "$0") [--staging] [--rotate]" >&2; exit 64 ;;
    esac
done

private_name="PASSPORT_PRIVATE_KEY${suffix}"
public_name="PASSPORT_PUBLIC_KEY${suffix}"

has_version() {
    [[ -n "$(gcloud secrets versions list "$1" --project="$PROJECT" \
        --filter='state=ENABLED' --limit=1 --format='value(name)' 2>/dev/null)" ]]
}

if ! $rotate && { has_version "$private_name" || has_version "$public_name"; }; then
    echo "$private_name / $public_name already hold a key. Re-run with --rotate to replace it" >&2
    echo "(every connected AI client will have to sign in again)." >&2
    exit 65
fi

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT
chmod 700 "$workdir"

openssl genrsa -out "$workdir/private.key" 4096 2>/dev/null
openssl rsa -in "$workdir/private.key" -pubout -out "$workdir/public.key" 2>/dev/null

for pair in "$private_name:private.key" "$public_name:public.key"; do
    name="${pair%%:*}"
    file="$workdir/${pair#*:}"

    if ! gcloud secrets describe "$name" --project="$PROJECT" >/dev/null 2>&1; then
        gcloud secrets create "$name" --replication-policy=automatic \
            --project="$PROJECT" >/dev/null
    fi

    gcloud secrets versions add "$name" --data-file="$file" \
        --project="$PROJECT" >/dev/null
    printf '  %-32s version added\n' "$name"
done
