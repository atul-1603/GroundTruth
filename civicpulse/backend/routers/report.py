from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from services import firestore, gemini, speech, translation, storage, priority
from middleware.auth import verify_firebase_token
import uuid

router = APIRouter(prefix="/report", tags=["Report"])

@router.post("/text")
async def submit_text_report(data: dict, user=Depends(verify_firebase_token)):
    text = data.get("text")
    activity_type = data.get("activityType", "SURVEY")
    language = await translation.detect_language(text)
    translated = await translation.translate_to_english(text, language)
    
    extracted = await gemini.gemini_pipeline.process_text_report(translated, activity_type, language)
    
    score = priority.calculate_priority_score(extracted.get("urgencyScore", 0), extracted.get("peopleAffected", 0), 0)
    
    report_data = {
        "activityId": data.get("activityId"),
        "userId": user["uid"],
        "ngoId": data.get("ngoId"),
        "activityType": activity_type,
        "rawInput": {"type": "text", "content": text},
        "extractedData": extracted,
        "priorityScore": score,
        "language": language,
        "translatedSummary": translated
    }
    await firestore.create_report(report_data)
    return report_data

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
