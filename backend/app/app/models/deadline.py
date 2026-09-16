from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey

from app.database.database import Base


class Deadline(Base):

    __tablename__ = "deadlines"

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

    description = Column(
        String(500),
        nullable=False
    )

    deadline_date = Column(
        Date,
        nullable=True
    )

    timestamp = Column(
        Float,
        nullable=True
    )