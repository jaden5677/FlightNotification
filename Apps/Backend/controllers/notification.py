from Backend.models import Notification
from Backend.database import db

def create_notification(flight_id, notif_type, message, gate, created_by):
    new_notification = Notification(flight_id=flight_id, notif_type=notif_type, message=message, gate=gate, created_by=created_by)
    db.session.add(new_notification)
    db.session.commit()
    return new_notification

def list_notification_by_flight(flight_id):
    result = db.session.execute(db.select(Notification).filter_by(flight_id=flight_id))
    return result.scalars().all()

