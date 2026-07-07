from Backend.database import db
from enum import Enum

class NotifType(Enum):
    DELAY = "Delay"
    CANCELLATION = "Cancellation"
    GATE_CHANGE = "Gate Change"
    BOARDING_CALL = "Boarding Call"
    OTHER = "Other"


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    flight_id = db.Column(db.Integer, db.ForeignKey('flights.id'), nullable=False)
    notif_type = db.Column(db.Enum(NotifType), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    gate = db.Column(db.String(10), nullable=True)
    created_by = db.Column(db.String(20), db.ForeignKey('users.usersID'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

