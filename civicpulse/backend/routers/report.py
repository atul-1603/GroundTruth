from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from services import firestore, gemini, speech, translation, storage, priority
from middleware.auth import verify_firebase_token
import uuid

router = APIRouter(prefix="/report", tags=["Report"])

@router.post("/text")
async def submit_text_report(data: dict, user=Depends(verify_firebase_token)):
    try:
        text = data.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="Text content is required")
            
        activity_type = data.get("activityType", "SURVEY")
        language = await translation.detect_language(text)
        translated = await translation.translate_to_english(text, language)
        
        extracted = await gemini.gemini_pipeline.process_text_report(translated, activity_type, language)
        
        # Priority Score logic update: if peopleAffected is 0, assume at least 1 person is affected to avoid low scores
        people_affected = max(extracted.get("peopleAffected", 1), 1)
        score = priority.calculate_priority_score(extracted.get("urgencyScore", 0), people_affected, 0)
        
        report_data = {
            "activityId": None, # Will be set if activity created
            "userId": user["uid"],
            "ngoId": data.get("ngoId"),
            "activityType": activity_type,
            "rawInput": {"type": "text", "content": text},
            "extractedData": extracted,
            "priorityScore": score,
            "language": language,
            "translatedSummary": translated
        }
        
        # Automatically create an activity for high/medium priority reports
        if score >= 4.0:
            # In a real app, geocode extracted location. 
            # For demo, generate random coords near Mumbai if needed
            import random
            mock_lat = 19.0760 + (random.random() - 0.5) * 0.1
            mock_lng = 72.8777 + (random.random() - 0.5) * 0.1
            
            act_data = {
                "title": f"Incident: {extracted.get('location', 'Unknown Location')}",
                "description": translated,
                "region": extracted.get('location', 'Unknown'),
                "ngoId": data.get("ngoId"),
                "activityType": activity_type,
                "priorityScore": score,
                "status": "open",
                "volunteersAssigned": [],
                "location": {"lat": mock_lat, "lng": mock_lng}
            }

            act_id = await firestore.create_activity(act_data)
            report_data["activityId"] = act_id
            
        await firestore.create_report(report_data)
        return report_data
    except Exception as e:
        print(f"Report submission error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/image")
async def submit_image_report(
    file: UploadFile = File(...),
    activityId: str = Form(...),
    activityType: str = Form("SURVEY"),
    ngoId: str = Form(...),
    caption: str = Form(""),
    user=Depends(verify_firebase_token)
):
    image_bytes = await file.read()
    url = await storage.upload_file(image_bytes, file.filename, file.content_type)
    
    extracted = await gemini.gemini_pipeline.process_image_report(image_bytes, activityType)
    score = priority.calculate_priority_score(extracted.get("urgencyScore", 0), extracted.get("peopleAffected", 0), 0)
    
    report_data = {
        "activityId": activityId,
        "userId": user["uid"],
        "ngoId": ngoId,
        "activityType": activityType,
        "rawInput": {"type": "image", "content": url},
        "extractedData": extracted,
        "priorityScore": score,
        "language": "en",
        "translatedSummary": caption
    }
    await firestore.create_report(report_data)
    return report_data

@router.post("/audio")
async def submit_audio_report(
    file: UploadFile = File(...),
    activityId: str = Form(...),
    activityType: str = Form("SURVEY"),
    ngoId: str = Form(...),
    language: str = Form("en-US"),
    user=Depends(verify_firebase_token)
):
    audio_bytes = await file.read()
    transcript = await speech.transcribe_audio(audio_bytes, language)
    
    translated = await translation.translate_to_english(transcript, language)
    extracted = await gemini.gemini_pipeline.process_text_report(translated, activityType, language)
    score = priority.calculate_priority_score(extracted.get("urgencyScore", 0), extracted.get("peopleAffected", 0), 0)
    
    url = await storage.upload_file(audio_bytes, file.filename, "audio/webm")
    
    report_data = {
        "activityId": activityId,
        "userId": user["uid"],
        "ngoId": ngoId,
        "activityType": activityType,
        "rawInput": {"type": "audio", "content": url},
        "extractedData": extracted,
        "priorityScore": score,
        "language": language,
        "translatedSummary": translated
    }
    await firestore.create_report(report_data)
    return report_data

@router.get("/{report_id}")
async def get_report(report_id: str, user=Depends(verify_firebase_token)):
    pass

@router.get("/activity/{activity_id}")
async def get_reports_by_activity(activity_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_reports_by_activity(activity_id)

@router.get("/user/{user_id}")
async def get_reports_by_user(user_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_reports_by_user(user_id)

@router.get("/ngo/{ngo_id}")
async def get_reports_by_ngo(ngo_id: str, user=Depends(verify_firebase_token)):
    return await firestore.get_reports_by_ngo(ngo_id)

@router.post("/{report_id}/convert")
async def convert_report_to_activity(report_id: str, data: dict, user=Depends(verify_firebase_token)):
    # Fetch existing report
    docs = await firestore.get_reports_by_ngo(user['uid']) # Simple way to check permissions or find report
    # We need a get_report by ID in firestore.py
    report = None
    # For now, let's just assume we can create it if we have the report_id
    # In a real app, you'd fetch the report from Firestore first.
    
    import random
    mock_lat = 19.0760 + (random.random() - 0.5) * 0.1
    mock_lng = 72.8777 + (random.random() - 0.5) * 0.1

    act_data = {
        "title": data.get("title", "New Task from Report"),
        "description": data.get("description", "Converted from field report"),
        "region": data.get("region", "Unknown"),
        "ngoId": user['uid'],
        "activityType": data.get("activityType", "SURVEY"),
        "priorityScore": data.get("priorityScore", 5.0),
        "status": "open",
        "volunteersAssigned": [],
        "deadline": data.get("deadline"),
        "location": {"lat": mock_lat, "lng": mock_lng}
    }
    
    act_id = await firestore.create_activity(act_data)
    # Update report with activityId
    # await firestore.update_report(report_id, {"activityId": act_id}) 
    
    return {"activityId": act_id}
