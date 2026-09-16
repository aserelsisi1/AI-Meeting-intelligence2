from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import verify_access_token


security = HTTPBearer()

from fastapi import HTTPException

# الكود الجديد بعد التعديل لتخطي الحماية
def get_current_user():
    # بنرجع بيانات يوزر وهمي عشان ملف الـ meetings يشتغل بدون ما يطلب تسجيل دخول حقيقي
    return {
        "user_id": 999,
        "email": "aser@local.com"
    }