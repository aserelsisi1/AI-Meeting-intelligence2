from sqlalchemy import Column, Integer, String, ForeignKey

from app.database.database import Base


class Participant(Base):

    __tablename__ = "participants"

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

    name = Column(
        String(150),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=True
    )