import firebase_admin
from firebase_admin import credentials, firestore
import os

# Set up Firebase Admin SDK
cred_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH', 'serviceAccountKey.json')
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def delete_collection(collection_name, batch_size=20):
    coll_ref = db.collection(collection_name)
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        print(f'Deleting doc {doc.id} from {collection_name} => {doc.to_dict().get("translatedSummary", doc.id)}')
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return delete_collection(collection_name, batch_size)

if __name__ == '__main__':
    print("--- Resetting CivicPulse Data ---")
    delete_collection('reports')
    delete_collection('activities')
    delete_collection('assignments')
    print("--- Reset Complete ---")
