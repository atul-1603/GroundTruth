# CivicPulse Deployment to Google Cloud Run

This directory contains the necessary scripts and configurations to deploy CivicPulse to Google Cloud Run.

## Prerequisites

- Google Cloud SDK (`gcloud`) installed and configured.
- Docker installed and running.
- Access to the GCP project: `civicpulse-dev-8349a`.
- Local `.env` file and `serviceAccountKey.json` in the project root.

## First-Time Setup (Run Once)

1. **Initialize GCP Environment**:
   ```bash
   bash deployment/setup-gcp.sh
   ```
   This script enables required APIs, creates an Artifact Registry repository, and configures Docker authentication.

2. **Upload Secrets**:
   ```bash
   bash deployment/env-secrets.sh
   ```
   This script reads your local `.env` and `serviceAccountKey.json` and creates secrets in GCP Secret Manager. This ensures sensitive data is not hardcoded in your deployment configurations.

## Deployment

To deploy both the frontend and backend:
```bash
bash deployment/deploy.sh
```

To deploy separately:
- **Backend Only**: `bash deployment/deploy-backend.sh`
- **Frontend Only**: `bash deployment/deploy-frontend.sh` (Requires the backend to be deployed at least once to get its URL).

## After Deployment Checklist

1. **Firebase Authentication**:
   - Go to [Firebase Console](https://console.firebase.google.com/) → Authentication → Settings → Authorized Domains.
   - Add your Cloud Run frontend URL (e.g., `civicpulse-frontend-xxx.run.app`).

2. **Google Maps API**:
   - Go to [GCP Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
   - Select your API key and add an HTTP referrer restriction: `https://civicpulse-frontend-xxx.run.app/*`.

3. **Firestore/Storage Rules**:
   - Ensure your rules are set for production (auth-required) rather than test mode.
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **CORS Configuration**:
   - The backend is configured to allow origins. Ensure the production frontend URL is added to the allowed origins list in the backend if necessary (check `backend/main.py`).

## Using Cloud Build (CI/CD)

You can also use the provided `cloudbuild-backend.yaml` and `cloudbuild-frontend.yaml` to set up automated triggers in Google Cloud Build.
