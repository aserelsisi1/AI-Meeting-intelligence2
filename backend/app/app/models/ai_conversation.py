from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from datetime import datetime

from app.database.database import Base


class AIConversation(Base):

    __tablename__ = "ai_conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id"),
        nullable=False
    )

    question = Column(
        Text,
        nullable=False
    )

    answer = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )