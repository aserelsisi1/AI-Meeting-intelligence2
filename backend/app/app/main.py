from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.database import models
from app.routers.auth import router as auth_router
from app.routers.meetings import router as meetings_router
from app.routers import participants
from app.routers import action_items
from app.routers import decisions


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participants.router)
app.include_router(auth_router)
app.include_router(meetings_router)
app.include_router(action_items.router)
app.include_router(decisions.router)




@app.get("/")
def home():

    return {
        "message": "AI Meeting Intelligence System is running!"
    }


@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "message": "Backend is working correctly"
    }