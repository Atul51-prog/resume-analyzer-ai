"""
security.py - Password hashing and JWT token creation/verification.

WHY: Using direct `bcrypt` library instead of passlib to avoid compatibility
bugs with newer bcrypt versions in Python 3.12/3.13/3.14.
"""
from datetime import datetime, timedelta
import bcrypt
from jose import jwt, JWTError
from app.core.config import settings


def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt."""
    # Ensure password is under 72 bytes as required by bcrypt
    pwd_bytes = password[:72].encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare plain password against stored hash."""
    try:
        pwd_bytes = plain_password[:72].encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except Exception:
        return False


def create_access_token(data: dict) -> str:
    """
    Create a JWT token with expiry.
    'data' usually contains {"sub": user_email} as the payload.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> str | None:
    """
    Decode and verify a JWT token.
    Returns the email (subject) if valid, None if invalid or expired.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
