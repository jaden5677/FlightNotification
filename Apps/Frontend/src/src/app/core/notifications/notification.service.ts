import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationDto, NotifType } from '../models/notification.model';

// Abstract DI token, mirrors POST /api/flights/<flight_number>/notify.
// Notifications are scoped to a whole flight on the real backend - there is
// no passenger-level recipient model, so `send()` does not take a passenger
// selection today. See passenger-list component for that gap.
@Injectable()
export abstract class NotificationService {
    abstract send(
        flightNumber: string,
        notifType: NotifType,
        message: string,
        gate: string | null,
    ): Observable<NotificationDto>;

    // Full notification history across all flights, newest first. Mirrors
    // GET /api/notifications; the dashboard groups the result by flight_number.
    abstract list(): Observable<NotificationDto[]>;
}
