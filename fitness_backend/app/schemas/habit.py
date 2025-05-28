from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    frequency: str


class HabitCreate(HabitBase):
    pass


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    frequency: Optional[str] = None


class HabitCompletionCreate(BaseModel):
    habit_id: int
    completed_date: datetime


class HabitCompletionResponse(BaseModel):
    id: int
    habit_id: int
    completed_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class HabitResponse(HabitBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    completions: List[HabitCompletionResponse] = []

    class Config:
        from_attributes = True

