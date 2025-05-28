from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date

from app.database import get_db
from app.models.user import User
from app.models.water_intake import WaterIntake
from app.schemas.water_intake import WaterIntakeCreate, WaterIntakeResponse
from app.auth.jwt import get_current_user

router = APIRouter()


@router.post("/", response_model=WaterIntakeResponse, status_code=status.HTTP_201_CREATED)
def create_water_intake(
    water_intake: WaterIntakeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    water_date = water_intake.date or datetime.utcnow()
    db_water = WaterIntake(
        user_id=current_user.id,
        amount_ml=water_intake.amount_ml,
        date=water_date,
    )
    db.add(db_water)
    db.commit()
    db.refresh(db_water)
    return db_water


@router.get("/", response_model=List[WaterIntakeResponse])
def read_water_intakes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    start_date: datetime = None,
    end_date: datetime = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(WaterIntake).filter(WaterIntake.user_id == current_user.id)

    if start_date:
        query = query.filter(WaterIntake.date >= start_date)
    if end_date:
        query = query.filter(WaterIntake.date <= end_date)

    return query.order_by(WaterIntake.date.desc()).offset(skip).limit(limit).all()


@router.get("/daily/{date_str}", response_model=float)
def get_daily_water_intake(
    date_str: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    water_entries = (
        db.query(WaterIntake)
        .filter(
            WaterIntake.user_id == current_user.id,
            WaterIntake.date.cast(date) == query_date,
        )
        .all()
    )

    if not water_entries:
        raise HTTPException(status_code=404, detail="No water intake recorded for this date")

    total_amount = sum(entry.amount_ml for entry in water_entries)
    return total_amount
