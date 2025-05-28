from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.journal import MoodTagResponse
from app.database import get_db
from app.models.journal import JournalEntry, MoodTag
from app.schemas.journal import JournalEntryCreate, JournalEntryUpdate, JournalEntryResponse
from app.auth.jwt import verify_token, TokenData 

router = APIRouter(prefix="/journal", tags=["journal"])

@router.get("/", response_model=List[JournalEntryResponse])
def get_journal_entries(token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    entries = db.query(JournalEntry).filter(JournalEntry.user_id == token_data.user_id).all()
    return entries

@router.post("/", response_model=JournalEntryResponse, status_code=status.HTTP_201_CREATED)
def create_journal_entry(entry: JournalEntryCreate, token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    db_entry = JournalEntry(
        title=entry.title,
        content=entry.content,
        date=entry.date,
        user_id=token_data.user_id
    )
    # Attach mood tags if any
    if entry.mood_tag_ids:
        mood_tags = db.query(MoodTag).filter(MoodTag.id.in_(entry.mood_tag_ids)).all()
        db_entry.mood_tags = mood_tags

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.put("/{entry_id}", response_model=JournalEntryResponse)
def update_journal_entry(entry_id: int, entry: JournalEntryUpdate, token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == token_data.user_id).first()
    if not db_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")

    db_entry.title = entry.title
    db_entry.content = entry.content
    db_entry.date = entry.date

    # Update mood tags
    if entry.mood_tag_ids:
        mood_tags = db.query(MoodTag).filter(MoodTag.id.in_(entry.mood_tag_ids)).all()
        db_entry.mood_tags = mood_tags
    else:
        db_entry.mood_tags = []

    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal_entry(entry_id: int, token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    db_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == token_data.user_id).first()
    if not db_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")

    db.delete(db_entry)
    db.commit()
    return None

# Route to get all mood tags
@router.get("/mood-tags", response_model=List[MoodTagResponse])
def get_mood_tags(db: Session = Depends(get_db)):
    tags = db.query(MoodTag).all()
    return tags
