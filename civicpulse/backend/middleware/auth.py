from fastapi import Header, HTTPException
from firebase_admin import auth

async def verify_firebase_token(authorization: str = Header(...)) -> dict:
    """
    1. Extract Bearer token from Authorization header
    2. Call firebase_admin.auth.verify_id_token(token)
    3. Return decoded token dict with uid, email, role
    4. Raise HTTPException 401 if invalid or expired
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")
