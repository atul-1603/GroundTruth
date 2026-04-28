from firebase_admin import storage
import uuid

async def upload_file(file_bytes: bytes, filename: str, content_type: str) -> str:
    """
    Uploads a file to Firebase Storage and returns the public URL.
    """
    bucket = storage.bucket()
    unique_filename = f"{uuid.uuid4()}_{filename}"
    blob = bucket.blob(unique_filename)
    blob.upload_from_string(file_bytes, content_type=content_type)
    blob.make_public()
    return blob.public_url
