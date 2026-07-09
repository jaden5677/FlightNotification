import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationDto, NotifType } from '../models/notification.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable()
export class HttpNotificationService extends NotificationService {
    private readonly http = inject(HttpClient);

    // created_by is derived server-side from the JWT, so it is not sent here.
    send(
        flightNumber: string,
        notifType: NotifType,
        message: string,
        gate: string | null,
    ): Observable<NotificationDto> {
        return this.http.post<NotificationDto>(
            `${API_BASE_URL}/api/flights/${encodeURIComponent(flightNumber)}/notify`,
            { notif_type: notifType, message, gate },
        );
    }
}
