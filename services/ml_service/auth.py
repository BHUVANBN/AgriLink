from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

JWT_SECRET = os.getenv("JWT_ACCESS_SECRET")
ALGORITHM = "HS256"

# Revocation state mirrored by the Auth service (see @agrilink/auth-middleware):
#   auth:tv:<userId>  -> current tokenVersion
#   auth:off:<userId> -> "1" when suspended
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
_redis = None


def _get_redis():
    global _redis
    if _redis is None:
        try:
            import redis.asyncio as aioredis
            _redis = aioredis.from_url(REDIS_URL, socket_timeout=0.5, socket_connect_timeout=0.5, decode_responses=True)
        except Exception:
            _redis = False  # library missing → revocation checks disabled
    return _redis or None


async def _check_revocation(payload: dict) -> None:
    sub = payload.get("sub")
    client = _get_redis()
    if not sub or client is None:
        return
    try:
        tv, off = await client.mget(f"auth:tv:{sub}", f"auth:off:{sub}")
    except Exception:
        return  # fail open: Redis outage must not take the ML service down
    if off == "1":
        raise HTTPException(status_code=403, detail="Account suspended")
    if tv is not None and int(tv) != int(payload.get("tokenVersion") or 0):
        raise HTTPException(status_code=401, detail="Session has been revoked")

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
        if payload.get("type") == "refresh":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    await _check_revocation(payload)
    return payload

def require_role(role: str):
    async def role_checker(user: dict = Depends(get_current_user)):
        user_role = str(user.get("role", "")).lower()
        target_role = role.lower()
        if user_role != target_role:
            raise HTTPException(status_code=403, detail=f"Required role: {role}")
        return user
    return role_checker

def require_any_role(*roles: str):
    async def role_checker(user: dict = Depends(get_current_user)):
        user_role = str(user.get("role", "")).lower()
        target_roles = [r.lower() for r in roles]
        if user_role not in target_roles:
            raise HTTPException(status_code=403, detail=f"Required one of roles: {', '.join(roles)}")
        return user
    return role_checker
