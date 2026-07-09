from Backend.models import Passenger
from Backend.database import db


def list_passengers_by_flight(flight_number):
    result = db.session.execute(db.select(Passenger).filter_by(flight_number=flight_number))
    return result.scalars().all()

def list_json_passengers_by_flight(flight_number):
    passengers = list_passengers_by_flight(flight_number)
    return [passenger.get_json() for passenger in passengers]
