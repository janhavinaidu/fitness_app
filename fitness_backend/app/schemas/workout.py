from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseResponse(ExerciseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: int
    date: Optional[datetime] = None


class WorkoutCreate(WorkoutBase):
    exercise_ids: List[int] = []


class WorkoutUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    exercise_ids: Optional[List[int]] = None


class WorkoutResponse(WorkoutBase):
    id: int
    user_id: int
    date: datetime
    created_at: datetime
    exercises: List[ExerciseResponse] = []

    class Config:
        from_attributes = True
