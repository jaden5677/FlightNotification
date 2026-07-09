import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PassengerService } from './passenger.service';
import { PassengerRow } from '../models/passenger.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable()
export class HttpPassengerService extends PassengerService {
    private readonly http = inject(HttpClient);

    listByFlight(flightNumber: string): Observable<PassengerRow[]> {
        return this.http.get<PassengerRow[]>(
            `${API_BASE_URL}/api/flights/${encodeURIComponent(flightNumber)}/passengers`,
        );
    }
}
