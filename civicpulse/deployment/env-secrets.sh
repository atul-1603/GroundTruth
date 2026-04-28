#!/bin/bash
set -e

PROJECT_ID="civicpulse-dev-8349a"

echo "=== Uploading secrets to GCP Secret Manager ==="

# Read from local .env file and create secrets
# Run from project root: bash deployment/env-secrets.sh

create_secret() {
  local name=$1
  local value=$2
  
  # Check if secret exists
  if gcloud secrets describe $name --project=$PROJECT_ID &>/dev/null; then
    # Update existing secret
    echo -n "$value" | gcloud secrets versions add $name \
      --data-file=- \
      --project=$PROJECT_ID
    echo "Updated secret: $name"
  else
    # Create new secret
    echo -n "$value" | gcloud secrets create $name \
      --data-file=- \
      --project=$PROJECT_ID \
      --replication-policy="automatic"
    echo "Created secret: $name"
  fi
}

# Load .env file
if [ ! -f .env ]; then
  echo "ERROR: .env file not found in project root"
  exit 1
fi

export $(cat .env | grep -v '#' | xargs)

# Push each secret
create_secret "FIREBASE_PROJECT_ID" "$FIREBASE_PROJECT_ID"
create_secret "FIREBASE_STORAGE_BUCKET" "$FIREBASE_STORAGE_BUCKET"
create_secret "GEMINI_API_KEY" "$GEMINI_API_KEY"
create_secret "GOOGLE_MAPS_API_KEY" "$GOOGLE_MAPS_API_KEY"
create_secret "GOOGLE_CLOUD_PROJECT" "$GOOGLE_CLOUD_PROJECT"
create_secret "SECRET_KEY" "$SECRET_KEY"
create_secret "SMTP_HOST" "$SMTP_HOST"
create_secret "SMTP_PORT" "$SMTP_PORT"
create_secret "SMTP_USER" "$SMTP_USER"
create_secret "SMTP_PASSWORD" "$SMTP_PASSWORD"
create_secret "EMAIL_FROM" "$EMAIL_FROM"

# serviceAccountKey.json as a secret (entire file content)
if [ -f serviceAccountKey.json ]; then
  if gcloud secrets describe "SERVICE_ACCOUNT_KEY" --project=$PROJECT_ID &>/dev/null; then
     gcloud secrets versions add "SERVICE_ACCOUNT_KEY" \
      --data-file=serviceAccountKey.json \
      --project=$PROJECT_ID
  else
    gcloud secrets create "SERVICE_ACCOUNT_KEY" \
      --data-file=serviceAccountKey.json \
      --project=$PROJECT_ID \
      --replication-policy="automatic"
  fi
  echo "Uploaded serviceAccountKey.json as secret"
fi

echo "=== All secrets uploaded. Now run: bash deployment/deploy.sh ==="
