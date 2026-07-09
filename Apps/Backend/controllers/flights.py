from Backend.models import Flights
from Backend.database import db


def createflight(flight_number, departure_airport, arrival_airport, departure_time, arrival_time, aircraftype):
    newflight = Flights(flight_number=flight_number, departure_airport=departure_airport, arrival_airport=arrival_airport, departure_time=departure_time, arrival_time=arrival_time, aircraftype=aircraftype)
    db.session.add(newflight)
    db.session.commit()
    return newflight

def getflight_by_number(flight_number):
    result = db.session.execute(db.select(Flights).filter_by(flight_number=flight_number))
    return result.scalar_one_or_none()

def get_all_flights():
    result = db.session.execute(db.select(Flights))
    return result.scalars().all()

def get_all_json_flights():
    flights = get_all_flights()
    return [flight.get_json() for flight in flights]

