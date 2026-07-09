import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { PassengerService } from './passenger.service';
import { PassengerRow } from '../models/passenger.model';

const NAMES = [
    'KASSISM/ALIMUDIN MR',
    'DABBASIE/LEWIS CURTIS MR',
    'HARMOO/SHANNON MS',
    'SWIFT/DILAINE MR',
    'SASBIHAN/AMY MS',
    'RAGBIR/GERARD MR',
    'HARRIMAN/AVIKASH MR',
    'MOHAMMED/SARAH MS',
];

@Injectable()
export class MockPassengerService extends PassengerService {
    listByFlight(flightNumber: string): Observable<PassengerRow[]> {
        const rows: PassengerRow[] = NAMES.map((name, i) => ({
            id: i + 1,
            name,
            origin: 'POS',
            destination: 'GEO',
            arrival: '2026-07-07T19:35:00',
            departure: '2026-07-07T15:35:00',
            flight_number: flightNumber,
        }));
        return of(rows).pipe(delay(200));
    }
}
