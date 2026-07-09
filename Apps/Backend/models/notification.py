from Backend.database import db
from Backend.models.notiftype import NotifType

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    flight_number = db.Column(db.String(), db.ForeignKey('flights.flight_number'), nullable=False)
    notif_type = db.Column(db.Enum(NotifType), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    gate = db.Column(db.String(10), nullable=True)
    created_by = db.Column(db.String(20), db.ForeignKey('users.usersID'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def __init__(self, flight_number, notif_type, message, gate, created_by):
        self.flight_number = flight_number
        self.notif_type = notif_type
        self.message = message
        self.gate = gate
        self.created_by = created_by

    def get_json(self):
        return {
            'id': self.id,
            'flight_number': self.flight_number,
            'notif_type': self.notif_type.value,
            'message': self.message,
            'gate': self.gate,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat()
        }

