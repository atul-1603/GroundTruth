from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class Location(BaseModel):
    lat: float
    lng: float
    address: str

class AssignedArea(BaseModel):
    type: Literal["radius", "polygon"]
    center: dict
    radiusMeters: int

class ActivityBase(BaseModel):
    title: str
    description: str
    region: str
    activityType: Literal["SURVEY", "WORK_EXECUTION"]
    location: Location
    assignedArea: AssignedArea
    domain: str

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    activityId: str
    ngoId: str
    volunteersAssigned: List[str]
    status: Literal["open", "in_progress", "resolved"]
    priorityScore: float
    createdAt: datetime
    resolvedAt: Optional[datetime]
