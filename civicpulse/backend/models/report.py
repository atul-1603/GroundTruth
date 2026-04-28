from pydantic import BaseModel
from typing import List, Optional, Dict, Literal
from datetime import datetime

class RawInput(BaseModel):
    type: Literal["text", "image", "audio"]
    content: str

class Need(BaseModel):
    category: str
    item: str
    quantity: int

class ExtractedData(BaseModel):
    demographics: Dict[str, int]
    needs: List[Need]
    urgencyScore: float
    location: str
    summary: str
    peopleAffected: int
    skillsNeeded: List[str]

class WorkData(BaseModel):
    taskIdReference: str
    hoursLogged: float
    materialsUsed: List[str]
    completionStatus: bool
    beforePhotoUrl: Optional[str]
    afterPhotoUrl: Optional[str]
    location: str

class ReportBase(BaseModel):
    activityId: str
    submissionId: str
    activityType: Literal["SURVEY", "WORK_EXECUTION"]
    rawInput: RawInput

class ReportResponse(ReportBase):
    reportId: str
    userId: str
    ngoId: str
    extractedData: Optional[ExtractedData]
    workData: Optional[WorkData]
    priorityScore: float
    language: str
    translatedSummary: str
    createdAt: datetime
