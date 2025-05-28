"""Routes for ML endpoints."""
from fastapi import APIRouter, HTTPException
from app.ml.workout_suggestor import workout_suggestor
from app.ml.mood_predictor import mood_predictor
from app.schemas.ml import (
    WorkoutPlanRequest,
    WorkoutPlanResponse,
    MoodPredictionRequest,
    MoodPredictionResponse
)

router = APIRouter(prefix="/api/ml", tags=["ml"])

@router.post("/workout-plan", response_model=WorkoutPlanResponse)
async def generate_workout_plan(request: WorkoutPlanRequest):
    """Generate a personalized workout plan."""
    try:
        result = workout_suggestor.generate_workout_plan(request.dict())
        return WorkoutPlanResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate workout plan: {str(e)}")

@router.post("/predict-mood", response_model=MoodPredictionResponse)
async def predict_mood(request: MoodPredictionRequest):
    """Predict mood from text input and get exercise suggestions."""
    try:
        prediction = mood_predictor.predict_mood(request.text)
        suggestions = mood_predictor.get_mood_suggestions(prediction["predicted_mood"])
        return MoodPredictionResponse(
            **prediction,
            suggestions=suggestions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to predict mood: {str(e)}")