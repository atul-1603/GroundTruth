from fastapi import APIRouter, Depends, HTTPException
from services import firestore
from middleware.auth import verify_firebase_token

router = APIRouter(prefix="/volunteer", tags=["Volunteer"])

@router.post("/login")
async def volunteer_login():
    return {"message": "Use Firebase Client SDK"}

@router.get("/{user_id}")
async def get_volunteer(user_id: str, user=Depends(verify_firebase_token)):
    vol = await firestore.get_volunteer(user_id)
    if not vol:
        raise HTTPException(status_code=404)
    return vol

@router.put("/{user_id}")
async def update_volunteer(user_id: str, data: dict, user=Depends(verify_firebase_token)):
    pass

@router.get("/{user_id}/tasks")
async def get_volunteer_tasks(user_id: str, user=Depends(verify_firebase_token)):
    vol = await firestore.get_volunteer(user_id)
    if not vol:
        return []
    tasks = []
    for act_id in vol.get('assignedActivityIds', []):
        act = await firestore.get_activity(act_id)
        if act:
            tasks.append(act)
    return tasks

@router.post("/{user_id}/tasks/{activity_id}/complete")
async def complete_task(user_id: str, activity_id: str, user=Depends(verify_firebase_token)):
    await firestore.update_activity_status(activity_id, 'resolved')
    return {"message": "Task completed"}
