import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { FlightService } from './flight.service';
import { FlightDto } from '../models/flight.model';

// Seeded with the same flight numbers/routes visible in the Figma
// "Select Flight Number" dropdown screenshot. Day offsets (relative to today)
// mirror the backend seed so mock mode spans past/present/future dates and the
// date-filtered dropdown is demonstrable offline.
const MOCK_FLIGHTS: FlightDto[] = [
    mkFlight(1, 'BW495', 'POS', 'BGI', -5),
    mkFlight(2, 'BW236', 'POS', 'CUR', -3),
    mkFlight(3, 'BW240', 'POS', 'BGI', -1),
    mkFlight(4, 'BW270', 'POS', 'BGI', 0),
    mkFlight(5, 'BW526', 'POS', 'BGI', 0),
    mkFlight(6, 'BW462', 'POS', 'GEO', 1),
    mkFlight(7, 'BW430', 'POS', 'GND', 3),
    mkFlight(8, 'BW482', 'POS', 'GEO', 7),
    mkFlight(9, 'BW696', 'POS', 'GEO', 7),
];

function mkFlight(
    id: number,
    flightNumber: string,
    origin: string,
    destination: string,
    dayOffset: number,
): FlightDto {
    // Departure at 15:35 on the offset day, arriving 4 hours later.
    const dep = new Date();
    dep.setDate(dep.getDate() + dayOffset);
    dep.setHours(15, 35, 0, 0);
    const arr = new Date(dep);
    arr.setHours(arr.getHours() + 4);
    return {
        id,
        flight_number: flightNumber,
        departure_airport: origin,
        arrival_airport: destination,
        departure_time: toLocalIso(dep),
        arrival_time: toLocalIso(arr),
        aircrafttype: 'B737',
    };
}

// Local-time ISO string (no timezone suffix) so isSameDay parses it back as the
// same local calendar day, matching the backend's naive datetimes.
function toLocalIso(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
}

@Injectable()
export class MockFlightService extends FlightService {
    search(date: Date | null, flightNumber: string | null): Observable<FlightDto[]> {
        let results = MOCK_FLIGHTS;
        if (flightNumber) {
            results = results.filter((f) => f.flight_number === flightNumber);
        }
        if (date) {
            results = results.filter((f) => isSameDay(f.departure_time, date));
        }
        return of(results).pipe(delay(300));
    }

    getByNumber(flightNumber: string): Observable<FlightDto | null> {
        const match = MOCK_FLIGHTS.find((f) => f.flight_number === flightNumber) ?? null;
        return of(match).pipe(delay(150));
    }
}

function isSameDay(iso: string, b: Date): boolean {
    const a = new Date(iso);
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}
