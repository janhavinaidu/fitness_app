from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

# Association table for many-to-many relationship between workouts and exercises
workout_exercises = Table(
    "workout_exercises",
    Base.metadata,
    Column("workout_id", Integer, ForeignKey("workouts.id")),
    Column("exercise_id", Integer, ForeignKey("exercises.id")),
)


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer)
    date = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="workouts")
    exercises = relationship("Exercise", secondary=workout_exercises, back_populates="workouts")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(Text, nullable=True)
    category = Column(String)  # cardio, strength, flexibility, etc.
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationship
    workouts = relationship("Workout", secondary=workout_exercises, back_populates="exercises")
