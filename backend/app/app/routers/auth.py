from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

# تم إيقاف استدعاء حماية التوكن مؤقتاً
# from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        user_data.password
    )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


@router.get("/me")
def get_me():
    # تخطي الحماية: إرجاع مستخدم وهمي دائماً بمجرد فتح الواجهة
    return {
        "message": "You are authenticated",
        "user": {
            "id": 999,
            "name": "Aser",
            "email": "aser@local.com"
        }
    }
    

@router.post("/login")
def login(user_data: UserLogin):
    # تخطي الحماية: قبول أي إيميل وباسورد دون الرجوع لقاعدة البيانات
    # سيتم توليد توكن وهمي لتمريره للفرونت إند وفتح النظام
    
    token = create_access_token(
        {
            "user_id": 999,
            "email": user_data.email
        }
    )

    return {
        "message": "Login successful (Bypassed)",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": 999,
            "name": "Aser",
            "email": user_data.email
        }
    }