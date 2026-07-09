import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PassengerRow } from '../models/passenger.model';

// Abstract DI token, mirrors GET /api/flights/<flight_number>/passengers.
@Injectable()
export abstract class PassengerService {
    abstract listByFlight(flightNumber: string): Observable<PassengerRow[]>;
}
