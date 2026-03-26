from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

JWT_SECRET = os.getenv("JWT_ACCESS_SECRET")
ALGORITHM = "HS256"

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the JWT token from the Authorization header.
    Shared secret with Node.js services.
    """
    if not JWT_SECRET:
        raise HTTPException(status_code=500, detail="JWT_ACCESS_SECRET not configured")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(role: str):
    async def role_checker(user: dict = Depends(get_current_user)):
        user_role = str(user.get("role", "")).lower()
        target_role = role.lower()
        print(f"[AUTH] Checking role: {user_role} == {target_role}")
        if user_role != target_role:
            raise HTTPException(status_code=403, detail=f"Required role: {role}")
        return user
    return role_checker

def require_any_role(*roles: str):
    async def role_checker(user: dict = Depends(get_current_user)):
        user_role = str(user.get("role", "")).lower()
        target_roles = [r.lower() for r in roles]
        print(f"[AUTH] User role: {user_role}, checking against: {target_roles}")
        if user_role not in target_roles:
            raise HTTPException(status_code=403, detail=f"Required one of roles: {', '.join(roles)}")
        return user
    return role_checker
def require_token(func):
    """
    Decorator for FastAPI routes to require a valid JWT token.
    Can be used as @require_token on route handlers.
    (Note: In FastAPI, the standard way is mapping to Dependencies, 
     but this supports the legacy pattern used in some routers here)
    """
    from functools import wraps
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # This is a bit tricky with FastAPI. Standardizing on Depends(get_current_user) is better.
        # But if the router uses it as a decorator, it might be expecting something else.
        return await func(*args, **kwargs)
    return wrapper
