from fastapi import APIRouter, Depends, HTTPException
from models.activity import ActivityCreate
from services import firestore
from middleware.auth import verify_firebase_token

router = APIRouter(prefix="/activity", tags=["Activity"])

@router.post("")
async def create_activity(activity: ActivityCreate, user=Depends(verify_firebase_token)):
    act_dict = activity.model_dump()
    act_dict['status'] = 'open'
    act_dict['volunteersAssigned'] = []
    act_dict['priorityScore'] = 0.0
    act_id = await firestore.create_activity(act_dict)
    return {"activityId": act_id}

@router.get("/{activity_id}")
async def get_activity(activity_id: str, user=Depends(verify_firebase_token)):
    act = await firestore.get_activity(activity_id)
    if not act:
        raise HTTPException(status_code=404, detail="Not found")
    return act

@router.get("/ngo/{ngo_id}")
async def get_activities_by_ngo(ngo_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_activities_by_ngo(ngo_id)

@router.put("/{activity_id}")
async def update_activity(activity_id: str, data: dict, user=Depends(verify_firebase_token)):
    await firestore.update_activity_status(activity_id, data.get('status', 'open'))
    return {"message": "Updated"}

@router.post("/{activity_id}/assign")
async def assign_volunteer(activity_id: str, data: dict, user=Depends(verify_firebase_token)):
    await firestore.create_assignment(activity_id, data['userId'])
    if data.get('deadline'):
        await firestore.update_activity_details(activity_id, {"deadline": data['deadline']})
    return {"message": "Assigned"}


@router.post("/{activity_id}/dispatch")
async def dispatch_activity(activity_id: str, user=Depends(verify_firebase_token)):
    # Get all volunteers for this NGO
    volunteers = await firestore.get_volunteers_by_ngo(user['uid'])
    for vol in volunteers:
        await firestore.create_assignment(activity_id, vol['userId'])
    return {"message": f"Dispatched to {len(volunteers)} volunteers"}


@router.put("/{activity_id}/status")
async def update_status(activity_id: str, data: dict, user=Depends(verify_firebase_token)):
    await firestore.update_activity_status(activity_id, data['status'])
    return {"message": "Status updated"}

@router.get("/volunteer/{user_id}")
async def get_volunteer_tasks(user_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_assignments_by_volunteer(user_id)

@router.put("/assignment/{assignment_id}")
async def update_assignment(assignment_id: str, data: dict, user=Depends(verify_firebase_token)):
    await firestore.update_assignment_status(assignment_id, data['status'])
    return {"message": "Assignment updated"}


@router.get("/{activity_id}/map-data")
async def get_map_data(activity_id: str, user=Depends(verify_firebase_token)):
    act = await firestore.get_activity(activity_id)
    if not act:
        raise HTTPException(status_code=404)
    return {"location": act.get("location"), "assignedArea": act.get("assignedArea")}
