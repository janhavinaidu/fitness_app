from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from users_store import get_user, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

@router.post("/login", response_model=LoginResponse)
async def login(user: UserLoginRequest):
    db_user = get_user(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Simulate token generation (dummy)
    dummy_token = "dummy_jwt_token_12345"

    return {
        "token": dummy_token,
        "user": {
            "username": db_user["username"],
            "email": db_user["email"],
        }
    }
