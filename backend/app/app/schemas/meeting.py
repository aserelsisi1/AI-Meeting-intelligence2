from datetime import datetime
from pydantic import BaseModel


class ParticipantResponse(BaseModel):
    id: int
    meeting_id: int
    name: str
    email: str | None = None


class MeetingCreate(BaseModel):
    title: str
    description: str | None = None
    meeting_date: datetime | None = None


class MeetingResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    meeting_date: datetime | None

    file_name: str | None
    file_type: str | None
    file_path: str | None
    duration: int | None
    status: str | None
    summary: str | None
    transcription: str | None
    participants: list[ParticipantResponse] = []
    created_at: datetime | None

    class Config:
        from_attributes = True
