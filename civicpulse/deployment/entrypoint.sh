#!/bin/sh
set -e

# The serviceAccountKey.json is now mounted directly by Cloud Run 
# at /app/serviceAccountKey.json via the --set-secrets flag.

exec "$@"
