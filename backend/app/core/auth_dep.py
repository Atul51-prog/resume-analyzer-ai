"""
auth_dep.py - FastAPI dependency to get the current authenticated user.

WHY: By using Depends(get_current_user) in route functions,
FastAPI automatically rejects requests without a valid JWT.
You never have to manually check auth in each route.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.security import decode_access_token
from app.models.models import User

# Extracts "Bearer <token>" from the Authorization header
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    email = decode_access_token(token)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
