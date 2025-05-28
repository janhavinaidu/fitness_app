# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import engine, Base

# Import all routers
from .routes.auth import router as auth_router
from .routes.users import router as users_router
from .routes.habits import router as habits_router
from .routes.water_intake import router as water_intake_router
from .routes.steps import router as steps_router
from .routes.journal import router as journal_router
from .routes.workout import router as workout_router
from .routes.ml import router as ml_router

settings = get_settings()

# Create DB tables
Base.metadata.create_all(bind=engine)

# Define the app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

# CORS configuration
origins = [
    "http://localhost:8081",  # Your frontend
    "http://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(habits_router, prefix="/api/habits", tags=["habits"])
app.include_router(water_intake_router, prefix="/api/water-intake", tags=["water-intake"])
app.include_router(steps_router, prefix="/api/steps", tags=["steps"])
app.include_router(journal_router, prefix="/api/journals", tags=["journals"])
app.include_router(workout_router, prefix="/api/workouts", tags=["workouts"])
app.include_router(ml_router, prefix="/api/ml", tags=["machine-learning"])

@app.get("/")
def root():
    return {"message": "API is running"}