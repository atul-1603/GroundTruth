#!/bin/bash
set -e

PROJECT_ID="civicpulse-dev-8349a"
REGION="asia-south1"
REPO_NAME="civicpulse"

echo "=== Setting up GCP for CivicPulse ==="

# Set project
gcloud config set project $PROJECT_ID

# Enable all required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com

echo "APIs enabled"

# Create Artifact Registry repository
gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="CivicPulse Docker images" \
  || echo "Repository already exists, continuing"

echo "Artifact Registry created: $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME"

# Configure Docker to use gcloud credentials
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

echo "=== Setup complete. Now run: bash deployment/env-secrets.sh ==="
