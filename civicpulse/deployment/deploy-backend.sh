#!/bin/bash
set -e

PROJECT_ID="civicpulse-dev-8349a"
REGION="asia-south1"
REPO_NAME="civicpulse"
SERVICE_NAME="civicpulse-backend"
IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend"

echo "=== Deploying Backend to Cloud Run ==="

# Build and push image
echo "Building backend Docker image..."
docker build -t $IMAGE:latest -f backend/Dockerfile.prod .
docker push $IMAGE:latest

echo "Image pushed: $IMAGE:latest"

# Get Cloud Run service account email
SA_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:civicpulse" \
  --format="value(email)" \
  --project=$PROJECT_ID 2>/dev/null || echo "")

# Create service account if it doesn't exist
if [ -z "$SA_EMAIL" ]; then
  gcloud iam service-accounts create civicpulse-backend \
    --display-name="civicpulse" \
    --project=$PROJECT_ID
  SA_EMAIL="civicpulse-backend@$PROJECT_ID.iam.gserviceaccount.com"
  
  # Grant Secret Manager access
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor"
  
  echo "Service account created: $SA_EMAIL"
fi

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --service-account=$SA_EMAIL \
  --port=8000 \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --timeout=300 \
  --set-secrets="\
FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID:latest,\
FIREBASE_STORAGE_BUCKET=FIREBASE_STORAGE_BUCKET:latest,\
GEMINI_API_KEY=GEMINI_API_KEY:latest,\
GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY:latest,\
GOOGLE_CLOUD_PROJECT=GOOGLE_CLOUD_PROJECT:latest,\
SECRET_KEY=SECRET_KEY:latest,\
SMTP_HOST=SMTP_HOST:latest,\
SMTP_PORT=SMTP_PORT:latest,\
SMTP_USER=SMTP_USER:latest,\
SMTP_PASSWORD=SMTP_PASSWORD:latest,\
EMAIL_FROM=EMAIL_FROM:latest,/etc/secrets/serviceAccountKey.json=SERVICE_ACCOUNT_KEY:latest" \
  --set-env-vars="ENVIRONMENT=production,GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/serviceAccountKey.json" \
  --project=$PROJECT_ID

# Get backend URL
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --format="value(status.url)" \
  --project=$PROJECT_ID)

echo ""
echo "=== Backend deployed successfully ==="
echo "Backend URL: $BACKEND_URL"
echo "Save this URL — you need it for frontend deployment"
echo "BACKEND_URL=$BACKEND_URL" > deployment/.backend_url
