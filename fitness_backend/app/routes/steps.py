from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.models.steps import Steps
from app.schemas.steps import StepsCreate, StepsResponse, StepsUpdate
from app.auth.jwt import get_current_user

router = APIRouter()

class UpdateStepsGoalRequest(BaseModel):
    daily_steps_goal: int

@router.put("/goal", response_model=dict)
def update_steps_goal(
    goal_update: UpdateStepsGoalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if goal_update.daily_steps_goal < 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Daily steps goal must be at least 1000"
        )
    
    current_user.daily_steps_goal = goal_update.daily_steps_goal
    db.commit()
    
    return {"message": "Steps goal updated successfully", "daily_steps_goal": goal_update.daily_steps_goal}

@router.post("/", response_model=StepsResponse, status_code=status.HTTP_201_CREATED)
def create_steps(
    steps: StepsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    steps_date = steps.date or datetime.utcnow()
    
    # Check if steps already recorded for this date
    existing_steps = (
        db.query(Steps)
        .filter(
            Steps.user_id == current_user.id,
            Steps.date.cast(date) == steps_date.date(),
        )
        .first()
    )
    
    if existing_steps:
        raise HTTPException(
            status_code=400,
            detail="Steps already recorded for this date. Use PUT to update."
        )
    
    db_steps = Steps(
        user_id=current_user.id,
        count=steps.count,
        date=steps_date,
    )
    db.add(db_steps)
    db.commit()
    db.refresh(db_steps)
    return db_steps


@router.get("/", response_model=List[StepsResponse])
def read_steps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    start_date: datetime = None,
    end_date: datetime = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Steps).filter(Steps.user_id == current_user.id)
    
    if start_date:
        query = query.filter(Steps.date >= start_date)
    if end_date:
        query = query.filter(Steps.date <= end_date)
    
    steps = query.order_by(Steps.date.desc()).offset(skip).limit(limit).all()
    return steps


@router.get("/daily/{date_str}", response_model=StepsResponse)
def get_daily_steps(
    date_str: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    steps = (
        db.query(Steps)
        .filter(
            Steps.user_id == current_user.id,
            Steps.date.cast(date) == query_date,
        )
        .first()
    )
    
    if steps is None:
        raise HTTPException(status_code=404, detail="No steps recorded for this date")
    
    return steps

@router.put("/daily/{date_str}", response_model=StepsResponse)
def update_daily_steps(
    date_str: str,
    steps_update: StepsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    steps = (
        db.query(Steps)
        .filter(
            Steps.user_id == current_user.id,
            Steps.date.cast(date) == query_date,
        )
        .first()
    )

    if steps is None:
        raise HTTPException(status_code=404, detail="No steps recorded for this date to update")

    # Update the step count
    steps.count = steps_update.count
    db.commit()
    db.refresh(steps)

    return steps
