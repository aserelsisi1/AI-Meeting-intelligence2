from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey

from app.database.database import Base


class ActionItem(Base):

    __tablename__ = "action_items"

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

    task = Column(
        Text,
        nullable=False
    )

    assigned_to = Column(
        String(150),
        nullable=True
    )

    deadline = Column(
        Date,
        nullable=True
    )

    status = Column(
        String(50),
        default="pending"
    )
    