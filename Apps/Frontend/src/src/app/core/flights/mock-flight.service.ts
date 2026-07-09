import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { FlightService } from './flight.service';
import { FlightDto } from '../models/flight.model';

// Seeded with the same flight numbers/routes visible in the Figma
// "Select Flight Number" dropdown screenshot.
const MOCK_FLIGHTS: FlightDto[] = [
    mkFlight(1, 'BW495', 'POS', 'BGI'),
    mkFlight(2, 'BW236', 'POS', 'CUR'),
    mkFlight(3, 'BW240', 'POS', 'BGI'),
    mkFlight(4, 'BW270', 'POS', 'BGI'),
    mkFlight(5, 'BW526', 'POS', 'BGI'),
    mkFlight(6, 'BW462', 'POS', 'GEO'),
    mkFlight(7, 'BW430', 'POS', 'GND'),
    mkFlight(8, 'BW482', 'POS', 'GEO'),
    mkFlight(9, 'BW696', 'POS', 'GEO'),
];

function mkFlight(id: number, flightNumber: string, origin: string, destination: string): FlightDto {
    return {
        id,
        flight_number: flightNumber,
        departure_airport: origin,
        arrival_airport: destination,
        departure_time: '2026-07-07T15:35:00',
        arrival_time: '2026-07-07T19:35:00',
        aircrafttype: 'B737',
    };
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
