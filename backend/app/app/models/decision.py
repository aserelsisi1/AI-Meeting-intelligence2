from sqlalchemy import Column, Integer, Text, Float, ForeignKey

from app.database.database import Base


class Decision(Base):

    __tablename__ = "decisions"

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

    decision = Column(
        Text,
        nullable=False
    )

    timestamp = Column(
        Float,
        nullable=True
    )