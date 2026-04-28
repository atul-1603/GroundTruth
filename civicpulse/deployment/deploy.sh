#!/bin/bash
set -e

echo "================================================"
echo "   CivicPulse — Full Deployment to Cloud Run"
echo "================================================"
echo ""

# Step 1: Deploy backend
echo "Step 1/2: Deploying backend..."
bash deployment/deploy-backend.sh

echo ""
echo "Step 2/2: Deploying frontend..."
bash deployment/deploy-frontend.sh

echo ""
echo "================================================"
echo "   DEPLOYMENT COMPLETE"
echo "================================================"

if [ -f deployment/.backend_url ]; then
  source deployment/.backend_url
fi

FRONTEND_URL=$(gcloud run services describe civicpulse-frontend \
  --region=asia-south1 \
  --format="value(status.url)" \
  --project=civicpulse-dev-8349a)

echo ""
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo ""
echo "IMPORTANT - Do these 3 things now:"
echo "1. Go to Firebase Console → Authentication → Settings → Authorized domains"
echo "   Add: ${FRONTEND_URL#https://}"
echo ""
echo "2. Go to Firebase Console → Firestore → Rules"
echo "   Change from test mode to production rules"
echo ""
echo "3. Go to GCP Console → APIs → Google Maps"  
echo "   Add referrer restriction: $FRONTEND_URL/*"
