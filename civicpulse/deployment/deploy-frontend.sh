#!/bin/bash
set -e

PROJECT_ID="civicpulse-dev-8349a"
REGION="asia-south1"
REPO_NAME="civicpulse"
SERVICE_NAME="civicpulse-frontend"
IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend"

# Get backend URL from previous deployment
if [ -f deployment/.backend_url ]; then
  source deployment/.backend_url
else
  echo "ERROR: Backend URL not found. Run deploy-backend.sh first."
  echo "Or manually set: export BACKEND_URL=https://your-backend-url"
  exit 1
fi

echo "=== Deploying Frontend to Cloud Run ==="
echo "Using backend URL: $BACKEND_URL"

# Load frontend Firebase config from .env
export $(cat .env | grep 'VITE_' | grep -v '#' | xargs)

# Build frontend image with build args injected
echo "Building frontend Docker image..."
docker build \
  -t $IMAGE:latest \
  -f frontend/Dockerfile.prod \
  --build-arg VITE_API_BASE_URL=$BACKEND_URL \
  --build-arg VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
  --build-arg VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
  --build-arg VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
  --build-arg VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY \
  ./frontend

docker push $IMAGE:latest

echo "Image pushed: $IMAGE:latest"

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=80 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --timeout=60 \
  --project=$PROJECT_ID

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --format="value(status.url)" \
  --project=$PROJECT_ID)

echo ""
echo "=== Frontend deployed successfully ==="
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "Add this to Firebase Auth → Authorized domains:"
echo "  ${FRONTEND_URL#https://}"
