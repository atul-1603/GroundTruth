from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GOOGLE_APPLICATION_CREDENTIALS: str = "./serviceAccountKey.json"
    FIREBASE_PROJECT_ID: str
    FIREBASE_STORAGE_BUCKET: str
    GEMINI_API_KEY: str
    GOOGLE_MAPS_API_KEY: str
    GOOGLE_CLOUD_PROJECT: str
    
    BACKEND_PORT: int = 8000
    SECRET_KEY: str = "change-this-in-production"
    ENVIRONMENT: str = "development"
    
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAIL_FROM: str = "noreply@civicpulse.org"

    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

settings = Settings()
