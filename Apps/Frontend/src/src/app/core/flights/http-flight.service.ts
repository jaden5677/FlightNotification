import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { FlightService } from './flight.service';
import { FlightDto } from '../models/flight.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable()
export class HttpFlightService extends FlightService {
    private readonly http = inject(HttpClient);

    // The backend has no date-filtered flight query, so fetch all and filter
    // client-side by flight number + departure date.
    search(date: Date | null, flightNumber: string | null): Observable<FlightDto[]> {
        return this.http.get<FlightDto[]>(`${API_BASE_URL}/api/flights`).pipe(
            map((flights) => {
                let results = flights;
                if (flightNumber) {
                    results = results.filter((f) => f.flight_number === flightNumber);
                }
                if (date) {
                    results = results.filter((f) => isSameDay(f.departure_time, date));
                }
                return results;
            }),
        );
    }

    getByNumber(flightNumber: string): Observable<FlightDto | null> {
        return this.http
            .get<FlightDto>(`${API_BASE_URL}/api/flights/${encodeURIComponent(flightNumber)}`)
            .pipe(catchError(() => of(null)));
    }
}

function isSameDay(iso: string, date: Date): boolean {
    const d = new Date(iso);
    return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
}
