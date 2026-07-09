from Backend.database import db


class Passenger(db.Model):
    __tablename__ = "passengers"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    flight_number = db.Column(db.String(10), db.ForeignKey('flights.flight_number'), nullable=False)

    # Each passenger belongs to one seeded flight; the row shown in the UI
    # combines the passenger name with that flight's origin/destination/times.
    flight = db.relationship('Flights')

    def __init__(self, full_name, flight_number):
        self.full_name = full_name
        self.flight_number = flight_number

    def get_json(self):
        flight = self.flight
        return {
            'id': self.id,
            'name': self.full_name,
            'origin': flight.departure_airport if flight else None,
            'destination': flight.arrival_airport if flight else None,
            'arrival': flight.arrival_time.isoformat() if flight else None,
            'departure': flight.departure_time.isoformat() if flight else None,
            'flight_number': self.flight_number,
        }
