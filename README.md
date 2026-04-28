# CivicPulse

CivicPulse is a smart NGO volunteer coordination platform. It enables NGOs to streamline their operations, manage volunteers efficiently, and leverage AI to prioritize and resolve issues reported from the field. Built for scalability and real-time response, it uses multimodal AI (text, image, audio) to understand field reports and automatically assign priority scores.

The platform provides a web-based dashboard for NGO administrators to visualize reports on an interactive map, and a dedicated interface for volunteers to log activities, upload images, and submit audio notes directly from the ground. With automated language translation and structured data extraction powered by Gemini, CivicPulse removes communication barriers and accelerates community care.

## Architecture

```text
                  +-------------------+
                  |   Nginx Reverse   |
                  |       Proxy       |
                  +---------+---------+
                            |
           +----------------+----------------+
           |                                 |
+----------v----------+           +----------v----------+
|  React + Vite PWA   |           |  FastAPI Backend    |
|  (Frontend App)     |           |  (REST API)         |
+----------+----------+           +----------+----------+
           |                                 |
           |    +-----------------------+    |
           +---->   Firebase Auth &     <----+
                |   Firestore DB        |
                +-----------------------+
                            |
                +-----------------------+
                | Google Cloud Services |
                | (Gemini, Maps, Speech |
                |  Translation)         |
                +-----------------------+
```

## Prerequisites

- Node.js (v20 or higher)
- Python (3.11 or higher)
- Docker and Docker Compose
- Firebase Project Account
- Google Cloud Platform Account

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atul-1603/GroundTruth.git
   cd GroundTruth/civicpulse
   ```

2. **Environment Variables:**
   Copy the example environment file and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

3. **Firebase & GCP Configuration:**
   - Download your Firebase Admin SDK `serviceAccountKey.json` and place it in the `civicpulse/backend/` directory and root directory depending on your setup.
   - Follow the Firebase and GCP setup sections below to populate the `.env` values.

4. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   - Frontend will be available at: http://localhost:5173
   - Backend API will be available at: http://localhost:8000

## Firebase Setup Instructions

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** and enable the Email/Password sign-in provider.
3. Enable **Firestore Database** in production mode.
4. Enable **Cloud Storage** for file uploads (images, audio).
5. Go to Project Settings -> Service Accounts -> "Generate new private key". Save this as `serviceAccountKey.json`.
6. Add a Web App to the project to get your `VITE_FIREBASE_*` config values.

## GCP API Enablement

You must enable the following APIs in your Google Cloud Console for the associated project:
- **Gemini API** (Generative Language API) - For text/image extraction.
- **Maps JavaScript API** - For rendering maps.
- **Places API** - For location autocomplete.
- **Distance Matrix API** - For distance calculations.
- **Cloud Translation API** - For multilingual support.
- **Cloud Speech-to-Text API** - For audio processing.

## Production Deployment Instructions

1. Ensure your `.env` contains production variables (`ENVIRONMENT=production`).
2. Run the production docker-compose file:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
3. Nginx will route port 80 traffic automatically to the React build and API. Set up HTTPS using certbot manually on your server instance.

## API Endpoint Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ngo/register` | Register new NGO with document uploads |
| POST | `/api/ngo/login` | NGO login, returns Firebase token |
| GET | `/api/ngo/{id}` | Get NGO profile details |
| GET | `/api/ngo/{id}/volunteers` | List all volunteers for an NGO |
| POST | `/api/ngo/{id}/volunteers` | Create volunteer and send credentials |
| POST | `/api/activity` | Create new activity |
| GET | `/api/activity/{id}` | Get single activity details |
| POST | `/api/activity/{id}/assign`| Assign volunteer to activity |
| POST | `/api/report/text` | Submit text report and trigger AI extraction |
| POST | `/api/report/image` | Submit image report to Gemini Vision |
| POST | `/api/report/audio` | Submit audio report to Speech-to-Text |
| GET | `/api/dashboard/{id}/stats` | Get dashboard aggregated statistics |

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v3, Zustand, Axios, Google Maps API |
| **Backend** | FastAPI (Python 3.11), Uvicorn, Pydantic |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **AI / ML** | Google Gemini 1.5 Pro API |
| **Integrations**| Google Cloud Translation API v3, Speech-to-Text API v2 |
| **File Storage**| Firebase Cloud Storage |
| **Infra** | Docker, Docker Compose, Nginx |
