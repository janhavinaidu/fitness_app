from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WaterIntakeBase(BaseModel):
    amount_ml: float
    date: Optional[datetime] = None


class WaterIntakeCreate(WaterIntakeBase):
    pass


class WaterIntakeResponse(WaterIntakeBase):
    id: int
    user_id: int
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True
