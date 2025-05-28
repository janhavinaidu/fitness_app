from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date

from app.database import get_db
from app.models.user import User
from app.models.habit import Habit, HabitCompletion
from app.schemas.habit import (
    HabitCreate,
    HabitResponse,
    HabitUpdate,
    HabitCompletionCreate,
    HabitCompletionResponse,
)
from app.auth.jwt import get_current_user

router = APIRouter()


@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_habit = Habit(
        user_id=current_user.id,
        name=habit.name,
        description=habit.description,
        frequency=habit.frequency,
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.get("/", response_model=List[HabitResponse])
def read_habits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    habits = (
        db.query(Habit)
        .filter(Habit.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return habits


@router.get("/{habit_id}", response_model=HabitResponse)
def read_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    habit: HabitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    habit_data = habit.dict(exclude_unset=True)
    for key, value in habit_data.items():
        setattr(db_habit, key, value)
    
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    db.delete(db_habit)
    db.commit()
    return None


@router.post("/completions", response_model=HabitCompletionResponse, status_code=status.HTTP_201_CREATED)
def complete_habit(
    completion: HabitCompletionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if habit exists and belongs to current user
    habit = db.query(Habit).filter(Habit.id == completion.habit_id, Habit.user_id == current_user.id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Check if habit already completed for this date
    existing_completion = (
        db.query(HabitCompletion)
        .filter(
            HabitCompletion.habit_id == completion.habit_id,
            HabitCompletion.completed_date.cast(date) == completion.completed_date.date(),
        )
        .first()
    )
    
    if existing_completion:
        raise HTTPException(status_code=400, detail="Habit already completed for this date")
    
    db_completion = HabitCompletion(
        habit_id=completion.habit_id,
        completed_date=completion.completed_date,
    )
    db.add(db_completion)
    db.commit()
    db.refresh(db_completion)
    return db_completion

