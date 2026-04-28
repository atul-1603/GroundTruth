import firebase_admin
from firebase_admin import credentials, firestore, storage
from config import settings
import os

def init_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred, {
            'projectId': settings.FIREBASE_PROJECT_ID,
            'storageBucket': settings.FIREBASE_STORAGE_BUCKET
        })

init_firebase()

db = firestore.client()
bucket = storage.bucket()
