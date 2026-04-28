from fastapi import APIRouter, Depends, HTTPException
from services import firestore, gemini
from middleware.auth import verify_firebase_token

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/{ngo_id}/stats")
async def get_dashboard_stats(ngo_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_dashboard_stats(ngo_id)

@router.get("/{ngo_id}/map-data")
async def get_dashboard_map(ngo_id: str, user=Depends(verify_firebase_token)):
    acts = await firestore.get_activities_by_ngo(ngo_id)
    return [{"id": a.get("activityId"), "location": a.get("location"), "status": a.get("status"), "priorityScore": a.get("priorityScore")} for a in acts]

@router.get("/{ngo_id}/priority-needs")
async def get_priority_needs(ngo_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_priority_needs(ngo_id)

@router.get("/{ngo_id}/insights")
async def get_insights(ngo_id: str, user=Depends(verify_firebase_token)):
    acts = await firestore.get_activities_by_ngo(ngo_id)
    return await gemini.gemini_pipeline.generate_dashboard_insights(acts)
