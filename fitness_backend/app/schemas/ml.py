"""Schema models for ML endpoints."""
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class WorkoutPlanRequest(BaseModel):
    fitness_level: str = Field(..., description="User's fitness level (beginner, intermediate, advanced)")
    goals: List[str] = Field(default_factory=list, description="List of fitness goals")
    preferences: Dict = Field(default_factory=dict, description="User's workout preferences")
    constraints: Dict = Field(default_factory=dict, description="User's workout constraints")

class WorkoutPlanResponse(BaseModel):
    workout_plan: Dict = Field(..., description="Generated workout plan")

class MoodPredictionRequest(BaseModel):
    text: str = Field(..., description="Text input for mood prediction")

class MoodPredictionResponse(BaseModel):
    predicted_mood: str = Field(..., description="Predicted mood")
    confidence: float = Field(..., description="Confidence score")
    mood_scores: Dict[str, float] = Field(..., description="Scores for each mood")
    suggestions: List[str] = Field(..., description="Activity suggestions based on mood") 