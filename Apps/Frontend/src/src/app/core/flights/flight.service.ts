import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightDto } from '../models/flight.model';

// Abstract DI token. The real backend only supports GET /api/flights (all)
// and GET /api/flights/<flight_number> (exact match) - no date filter yet.
// MockFlightService.search() simulates the date+number filter the Figma
// screens expect; closing that gap on the backend is separate follow-up work.
@Injectable()
export abstract class FlightService {
    abstract search(date: Date | null, flightNumber: string | null): Observable<FlightDto[]>;
    abstract getByNumber(flightNumber: string): Observable<FlightDto | null>;
}
