from sqlalchemy import Boolean, Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String)
    daily_steps_goal = Column(Integer, default=10000)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    journal_entries = relationship("JournalEntry", back_populates="user")
    workouts = relationship("Workout", back_populates="user")
    habits = relationship("Habit", back_populates="user")
    water_intakes = relationship("WaterIntake", back_populates="user")
    steps = relationship("Steps", back_populates="user")
