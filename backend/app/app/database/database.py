from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# تم إضافة رابط SQLite كحل بديل تلقائي في حالة عدم وجود ملف .env
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./meetings.db")

# إضافة إعدادات الاتصال الخاصة بـ SQLite لمنع مشاكل الـ Threads في FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()