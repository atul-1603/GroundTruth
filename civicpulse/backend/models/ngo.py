from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class NGOBase(BaseModel):
    name: str
    email: EmailStr
    address: str
    region: str
    workDomain: List[str]
    type: str
    presidentName: str
    govId: str

class NGOCreate(NGOBase):
    password: str

class NGOResponse(NGOBase):
    id: str
    websiteDomainEmails: List[str]
    certificateUrl: str
    logoUrl: str
    activities: List[str]
    createdAt: datetime
    verified: bool
