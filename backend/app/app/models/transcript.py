from sqlalchemy import Column, Integer, Text, Float, ForeignKey

from app.database.database import Base


class Transcript(Base):

    __tablename__ = "transcripts"

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

    speaker_id = Column(
        Integer,
        ForeignKey("speakers.id"),
        nullable=True
    )

    text = Column(
        Text,
        nullable=False
    )

    start_time = Column(
        Float,
        nullable=False
    )

    end_time = Column(
        Float,
        nullable=False
    )