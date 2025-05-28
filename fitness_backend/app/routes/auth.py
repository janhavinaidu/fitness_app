from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.user import User
from app.auth.utils import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from app.config import get_settings
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()

# Pydantic models for Register
class UserRegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    
    class Config:
        from_attributes = True

class RegisterResponse(BaseModel):
    access_token: str
    user: UserResponse

# Pydantic models for Login
class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    user: UserResponse

# Register endpoint
@router.post("/register", response_model=RegisterResponse)
async def register(user: UserRegisterRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Attempting to register user with email: {user.email}")
        
        # Check if email already exists
        if db.query(User).filter(User.email == user.email).first():
            logger.warning(f"Email already registered: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        if db.query(User).filter(User.username == user.username).first():
            logger.warning(f"Username already taken: {user.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        try:
            hashed_password = get_password_hash(user.password)
            logger.debug(f"Password hashed successfully for user: {user.email}")
            
            db_user = User(
                email=user.email,
                username=user.username,
                hashed_password=hashed_password
            )
            
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
            logger.info(f"Successfully created user with email: {user.email}")
            
            # Create access token
            access_token = create_access_token(
                data={"sub": db_user.email},
                expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            )
            
            return {
                "access_token": access_token,
                "user": db_user
            }
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating user: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user: {str(e)}"
            )
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# Login endpoint
@router.post("/login", response_model=LoginResponse)
async def login(user: UserLoginRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Login attempt for email: {user.email}")
        
        # Find user by email
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user:
            logger.warning(f"User not found: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        logger.debug(f"Found user: {db_user.email}, attempting password verification")
        
        # Verify password
        if not verify_password(user.password, db_user.hashed_password):
            logger.warning(f"Invalid password for user: {user.email}")
            logger.debug(f"Provided password hash: {get_password_hash(user.password)}")
            logger.debug(f"Stored password hash: {db_user.hashed_password}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": db_user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        logger.info(f"Successful login for user: {user.email}")
        
        return {
            "access_token": access_token,
            "user": db_user
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
