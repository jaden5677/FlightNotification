import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationDto, NotifType } from '../models/notification.model';

let nextId = 1;

// Module-level store so notifications sent during a mock session persist and
// surface on the dashboard via list().
const SENT: NotificationDto[] = [];

@Injectable()
export class MockNotificationService extends NotificationService {
    send(
        flightNumber: string,
        notifType: NotifType,
        message: string,
        gate: string | null,
    ): Observable<NotificationDto> {
        const notification: NotificationDto = {
            id: nextId++,
            flight_number: flightNumber,
            notif_type: notifType,
            message,
            gate,
            created_by: 'AD101',
            created_at: new Date(),
        };
        SENT.push(notification);
        return of(notification).pipe(delay(400));
    }

    list(): Observable<NotificationDto[]> {
        // Newest first, mirroring the backend ordering.
        const history = [...SENT].reverse();
        return of(history).pipe(delay(300));
    }
}
