from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from models.ngo import NGOCreate, NGOResponse
from services import firestore, email
from middleware.auth import verify_firebase_token
from firebase_admin import auth

router = APIRouter(prefix="/ngo", tags=["NGO"])

@router.post("/register")
async def register_ngo(ngo: NGOCreate):
    try:
        user = auth.create_user(email=ngo.email, password=ngo.password)
        ngo_dict = ngo.model_dump()
        ngo_dict.pop('password')
        ngo_dict['verified'] = False
        ngo_dict['websiteDomainEmails'] = []
        ngo_dict['activities'] = []
        ngo_dict['certificateUrl'] = ""
        ngo_dict['logoUrl'] = ""
        
        # We store NGO and map user UID
        ngo_id = await firestore.create_ngo(ngo_dict)
        return {"id": ngo_id, "message": "Registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login_ngo():
    # Firebase handles login on client and we send token.
    # This route is mostly a stub if needed. Client gets custom token directly.
    return {"message": "Use Firebase Client SDK for login"}

@router.get("/{ngo_id}")
async def get_ngo(ngo_id: str, user=Depends(verify_firebase_token)):
    ngo = await firestore.get_ngo(ngo_id)
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo

@router.put("/{ngo_id}")
async def update_ngo(ngo_id: str, data: dict, user=Depends(verify_firebase_token)):
    await firestore.update_ngo(ngo_id, data)
    return {"message": "Updated"}

@router.get("/{ngo_id}/volunteers")
async def list_volunteers(ngo_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_volunteers_by_ngo(ngo_id)

@router.post("/{ngo_id}/volunteers")
async def add_volunteer(ngo_id: str, data: dict, user=Depends(verify_firebase_token)):
    volunteer_name = data.get('name')
    recipient_email = data.get('personal_email')
    ngo_data = await firestore.get_ngo(ngo_id)
    
    volunteer_email = email.generate_volunteer_email(volunteer_name, ngo_id)
    temp_password = "Temp" + volunteer_name[:4] + "123!"
    
    try:
        new_user = auth.create_user(email=volunteer_email, password=temp_password)
        data['userId'] = new_user.uid
        data['ngoId'] = ngo_id
        data['email'] = volunteer_email
        data['role'] = "volunteer"
        data['assignedActivityIds'] = []
        data['fatigueScore'] = 0.0
        data['tasksCompletedThisWeek'] = 0
        data['isActive'] = True
        
        await firestore.create_volunteer(data)
        await email.send_volunteer_credentials(volunteer_name, volunteer_email, temp_password, ngo_data['name'], recipient_email)
        return {"message": "Volunteer added"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{ngo_id}/volunteers/{user_id}")
async def remove_volunteer(ngo_id: str, user_id: str, user=Depends(verify_firebase_token)):
    auth.delete_user(user_id)
    # also remove from firestore logically
    await firestore.update_volunteer_fatigue(user_id, -1) # mark inactive etc
    return {"message": "Volunteer removed"}
