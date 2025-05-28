from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from users_store import add_user, get_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserRegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr

class RegisterResponse(BaseModel):
    token: str
    user: UserResponse

@router.post("/register", response_model=RegisterResponse)
async def register(user: UserRegisterRequest):
    # Check if user already exists in "DB"
    if get_user(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Add user to in-memory DB
    add_user(user.username, user.email, user.password)

    # Simulate token generation (you can implement JWT later)
    dummy_token = "dummy_jwt_token_12345"

    return {
        "token": dummy_token,
        "user": {
            "username": user.username,
            "email": user.email,
        }
    }
