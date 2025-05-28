# app/routes/workout.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.workout import Workout, Exercise
from app.schemas.workout import (
    WorkoutCreate,
    WorkoutResponse,
    WorkoutUpdate,
    ExerciseCreate,
    ExerciseResponse,
)
from app.auth.jwt import get_current_user

router = APIRouter()


@router.post("/", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
def create_workout(
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workout_date = workout.date or datetime.utcnow()
    
    db_workout = Workout(
        user_id=current_user.id,
        name=workout.name,
        description=workout.description,
        duration_minutes=workout.duration_minutes,
        date=workout_date,
    )
    
    # Add exercises if provided
    if workout.exercise_ids:
        exercises = db.query(Exercise).filter(Exercise.id.in_(workout.exercise_ids)).all()
        db_workout.exercises = exercises
    
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout


@router.get("/", response_model=List[WorkoutResponse])
def read_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    workouts = (
        db.query(Workout)
        .filter(Workout.user_id == current_user.id)
        .order_by(Workout.date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return workouts


@router.get("/{workout_id}", response_model=WorkoutResponse)
def read_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == current_user.id).first()
    if workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.put("/{workout_id}", response_model=WorkoutResponse)
def update_workout(
    workout_id: int,
    workout: WorkoutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == current_user.id).first()
    if db_workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    workout_data = workout.dict(exclude_unset=True)
    
    # Handle exercises separately
    if "exercise_ids" in workout_data:
        exercise_ids = workout_data.pop("exercise_ids")
        if exercise_ids is not None:
            exercises = db.query(Exercise).filter(Exercise.id.in_(exercise_ids)).all()
            db_workout.exercises = exercises
    
    # Update other fields
    for key, value in workout_data.items():
        setattr(db_workout, key, value)
    
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout


@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == current_user.id).first()
    if db_workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    db.delete(db_workout)
    db.commit()
    return None


@router.post("/exercises", response_model=ExerciseResponse, status_code=status.HTTP_201_CREATED)
def create_exercise(
    exercise: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # For authorization
):
    existing_exercise = db.query(Exercise).filter(Exercise.name == exercise.name).first()
    if existing_exercise:
        return existing_exercise
    
    db_exercise = Exercise(
        name=exercise.name,
        description=exercise.description,
        category=exercise.category,
    )
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    return db_exercise


@router.get("/exercises", response_model=List[ExerciseResponse])
def read_exercises(
    db: Session = Depends(get_db),
    category: str = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Exercise)
    
    if category:
        query = query.filter(Exercise.category == category)
    
    exercises = query.offset(skip).limit(limit).all()
    return exercises