from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

# Association table for many-to-many relation between JournalEntry and MoodTag
journal_mood_tag = Table(
    "journal_mood_tag",
    Base.metadata,
    Column("journal_id", Integer, ForeignKey("journal_entries.id")),
    Column("mood_tag_id", Integer, ForeignKey("mood_tags.id"))
)

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="journal_entries")
    mood_tags = relationship("MoodTag", secondary=journal_mood_tag, back_populates="journal_entries")

class MoodTag(Base):
    __tablename__ = "mood_tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    journal_entries = relationship("JournalEntry", secondary=journal_mood_tag, back_populates="mood_tags")
