from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class VolunteerBase(BaseModel):
    name: str
    address: str
    age: int
    gender: str
    phoneNo: str
    skills: List[str]
    domainOfWork: str

class VolunteerCreate(VolunteerBase):
    personal_email: EmailStr

class VolunteerResponse(VolunteerBase):
    userId: str
    ngoId: str
    email: EmailStr
    role: str
    assignedActivityIds: List[str]
    fatigueScore: float
    tasksCompletedThisWeek: int
    createdAt: datetime
    isActive: bool
