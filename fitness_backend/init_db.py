from app.database import engine, Base
from app.models.user import User
from app.models.journal import JournalEntry, MoodTag
from app.models.workout import Exercise, Workout
from app.models.habit import Habit, HabitCompletion
from app.models.water_intake import WaterIntake
from app.models.steps import Steps

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db() 