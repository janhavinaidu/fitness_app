from datetime import datetime, timedelta
from typing import Optional, Dict

import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Security configuration
SECRET_KEY = "your-secret-key"  # TODO: Move to environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class TokenData(BaseModel):
    user_id: str
    username: str
    exp: datetime

def decode_token(token: str) -> TokenData:
    """
    Decode and validate a JWT token, returning the token data.
    Raises HTTPException if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        username = payload.get("username")
        exp = datetime.fromtimestamp(payload.get("exp"))
        
        if not user_id or not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
            
        return TokenData(user_id=user_id, username=username, exp=exp)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def create_access_token(user_id: str, username: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token for the given user.
    """
    expires_delta = expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    
    to_encode = {
        "sub": str(user_id),  # JWT standard claim for subject
        "username": username,
        "exp": expire,
        "iat": datetime.utcnow()  # Issued at claim
    }
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """
    Verify and decode the token from the HTTP Authorization header.
    """
    return decode_token(credentials.credentials)

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, str]:
    """
    Get the current user from the OAuth2 token.
    Returns a dict with user_id and username.
    """
    token_data = decode_token(token)
    return {
        "user_id": token_data.user_id,
        "username": token_data.username
    }
