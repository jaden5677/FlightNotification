from Backend.database import db

class Flights(db.Model):
    __tablename__ = "flights"
    id = db.Column(db.Integer, primary_key = True)
    flight_number = db.Column(db.String(10), nullable = False, unique = True)
    departure_airport = db.Column(db.String(20), nullable = False)
    arrival_airport = db.Column(db.String(50), nullable = False)
    departure_time = db.Column(db.DateTime, nullable = False)
    arrival_time = db.Column(db.DateTime, nullable = False)
    aircraftype =db.Column(db.String(20), nullable = False)

    def __init__(self, id, flight_number, departure_airport, arrival_airport, departure_time, arrival_time, aircraftype):
        self.id = id
        self.flight_number = flight_number
        self.departure_airport = departure_airport
        self.arrival_airport = arrival_airport
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.aircraftype = aircraftype
    
    def get_json(self):
        return {
            'id': self.id,
            'flight_number': self.flight_number,
            'departure_airport': self.departure_airport,
            'arrival_airport': self.arrival_airport,
            'departure_time': self.departure_time.isoformat(),
            'arrival_time': self.arrival_time.isoformat(),
            'aircrafttype': self.aircraftype
        }