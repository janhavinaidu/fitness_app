from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    PROJECT_NAME: str = "Fitness & Wellness API"
    PROJECT_VERSION: str = "1.0.0"
    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./fitness_app.db"
    SECRET_KEY: str = "your-secret-key-replace-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # CORS settings
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:5173",  # Added Vite's default port
        "http://localhost:8081",  # Added your frontend port
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    return Settings()