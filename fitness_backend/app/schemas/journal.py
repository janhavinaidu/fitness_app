from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class MoodTagCreate(BaseModel):
    name: str  # changed from 'mood' to 'name'

class MoodTagResponse(BaseModel):
    id: int
    name: str  # Fixed naming

    class Config:
        from_attributes = True  # Updated from orm_mode

class JournalEntryBase(BaseModel):
    title: str
    content: str

class JournalEntryCreate(JournalEntryBase):
    mood_tag_ids: Optional[List[int]] = []

class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood_tag_ids: Optional[List[int]] = []

class JournalEntryResponse(JournalEntryBase):
    id: int
    date: datetime
    created_at: datetime
    mood_tags: List[MoodTagResponse] = []  # Add this

    class Config:
        from_attributes = True  # Updated from orm_mode
