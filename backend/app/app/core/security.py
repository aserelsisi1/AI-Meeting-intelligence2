from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext
from jose import jwt, JWTError


# Password hashing
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


# JWT settings
SECRET_KEY = "your-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# -------------------------
# PASSWORD FUNCTIONS
# -------------------------

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# -------------------------
# JWT FUNCTIONS
# -------------------------

def create_access_token(data: dict):

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode = data.copy()
    to_encode.update({
        "exp": expire
    })

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def verify_access_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")
        email = payload.get("email")

        if user_id is None or email is None:
            return None

        return {
            "user_id": user_id,
            "email": email,
            "exp": payload.get("exp")
        }

    except JWTError:

        return None