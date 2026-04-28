import firebase_admin
from firebase_admin import credentials, firestore
import os

cred_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH', 'serviceAccountKey.json')
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def update_ngo_locations():
    ngos = db.collection('ngos').stream()
    for ngo in ngos:
        print(f"Updating NGO {ngo.id} location...")
        db.collection('ngos').document(ngo.id).update({
            'lat': 19.1176, # Near Andheri, Mumbai
            'lng': 72.8631
        })

if __name__ == '__main__':
    update_ngo_locations()
    print("Done")
