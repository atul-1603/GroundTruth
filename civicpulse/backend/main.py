from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
import firebase_config  # Initializes Firebase
from routers import ngo, volunteer, activity, report, dashboard

app = FastAPI(title="CivicPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ngo.router, prefix="/api")
app.include_router(volunteer.router, prefix="/api")
app.include_router(activity.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
