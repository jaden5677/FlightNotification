from datetime import datetime, timedelta

from .user import create_user
from Backend.database import db
from Backend.models.accttype import AccountTypeEnum
from Backend.models import Flights, Passenger

# Flights shown in the Figma "Select Flight Number" dropdown
# (number, origin, dest, day_offset). day_offset is relative to the current
# date at seed time so the set always spans past, present, and future dates -
# this keeps the date-filtered flight dropdown demonstrable regardless of when
# /init runs. Two flights share offset 0 so a single day can list several.
SEED_FLIGHTS = [
    ('BW495', 'POS', 'BGI', -5),
    ('BW236', 'POS', 'CUR', -3),
    ('BW240', 'POS', 'BGI', -1),
    ('BW270', 'POS', 'BGI', 0),
    ('BW526', 'POS', 'BGI', 0),
    ('BW462', 'POS', 'GEO', 1),
    ('BW430', 'POS', 'GND', 3),
    ('BW482', 'POS', 'GEO', 7),
    ('BW696', 'POS', 'GEO', 7),
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

def _flight_times(day_offset):
    # Departure at 15:35 on the offset day, arriving 4 hours later.
    dep = (datetime.now() + timedelta(days=day_offset)).replace(
        hour=15, minute=35, second=0, microsecond=0)
    return dep, dep + timedelta(hours=4)


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
        for number, origin, destination, day_offset in SEED_FLIGHTS:
            departure_time, arrival_time = _flight_times(day_offset)
            db.session.add(Flights(
                flight_number=number,
                departure_airport=origin,
                arrival_airport=destination,
                departure_time=departure_time,
                arrival_time=arrival_time,
                aircraftype='B737',
            ))
        db.session.commit()

    if db.session.execute(db.select(Passenger)).first() is None:
        for number, _origin, _destination, _offset in SEED_FLIGHTS:
            for name in SEED_PASSENGERS:
                db.session.add(Passenger(full_name=name, flight_number=number))
        db.session.commit()
