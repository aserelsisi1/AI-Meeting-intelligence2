from sqlalchemy import Column, Integer, String, ForeignKey

from app.database.database import Base


class Speaker(Base):

    __tablename__ = "speakers"

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

    speaker_label = Column(
        String(100),
        nullable=False
    )

    speaker_name = Column(
        String(150),
        nullable=True
    )