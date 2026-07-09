from datetime import datetime

from .user import create_user
from Backend.database import db
from Backend.models.accttype import AccountTypeEnum
from Backend.models import Flights, Passenger

# Flights shown in the Figma "Select Flight Number" dropdown (number, origin, dest).
SEED_FLIGHTS = [
    ('BW495', 'POS', 'BGI'),
    ('BW236', 'POS', 'CUR'),
    ('BW240', 'POS', 'BGI'),
    ('BW270', 'POS', 'BGI'),
    ('BW526', 'POS', 'BGI'),
    ('BW462', 'POS', 'GEO'),
    ('BW430', 'POS', 'GND'),
    ('BW482', 'POS', 'GEO'),
    ('BW696', 'POS', 'GEO'),
]

# Passenger names from the Figma passenger table, seeded onto every flight.
SEED_PASSENGERS = [
    'KASSISM/ALIMUDIN MR',
    'DABBASIE/LEWIS CURTIS MR',
    'HARMOO/SHANNON MS',
    'SWIFT/DILAINE MR',
    'SASBIHAN/AMY MS',
    'RAGBIR/GERARD MR',
    'HARRIMAN/AVIKASH MR',
    'MOHAMMED/SARAH MS',
]

DEPARTURE_TIME = datetime(2026, 7, 7, 15, 35)
ARRIVAL_TIME = datetime(2026, 7, 7, 19, 35)


def initialize():
    # Idempotent: safe to run on every container start. Creates tables if
    # missing and seeds each entity only when its table is empty, so existing
    # data (e.g. notifications sent during a session) survives a restart.
    db.create_all()

    from Backend.models import User
    if db.session.execute(db.select(User)).first() is None:
        create_user('AD101', 'Jaden', 'Sooklal', 'jaden.sooklal@caribbean-airlines.com',
                    None, "JayPass", None, None, None, None, AccountTypeEnum.ADMIN, None)

    if db.session.execute(db.select(Flights)).first() is None:
        for number, origin, destination in SEED_FLIGHTS:
            db.session.add(Flights(
                flight_number=number,
                departure_airport=origin,
                arrival_airport=destination,
                departure_time=DEPARTURE_TIME,
                arrival_time=ARRIVAL_TIME,
                aircraftype='B737',
            ))
        db.session.commit()

    if db.session.execute(db.select(Passenger)).first() is None:
        for number, _origin, _destination in SEED_FLIGHTS:
            for name in SEED_PASSENGERS:
                db.session.add(Passenger(full_name=name, flight_number=number))
        db.session.commit()
