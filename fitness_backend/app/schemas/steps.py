from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StepsBase(BaseModel):
    count: int
    date: Optional[datetime] = None


class StepsCreate(StepsBase):
    pass


class StepsUpdate(BaseModel):
    count: int


class StepsResponse(StepsBase):
    id: int
    user_id: int
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True
