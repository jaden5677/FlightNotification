import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { FlightService } from '../../core/flights/flight.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { PassengerService } from '../../core/passengers/passenger.service';
import { FlightDto } from '../../core/models/flight.model';
import { NotificationDto } from '../../core/models/notification.model';

// One flight and every notification sent against it, newest first, plus the
// current passenger roster size (derived - the backend does not persist a
// per-notification recipient count).
interface FlightGroup {
    flightNumber: string;
    flight: FlightDto | null;
    notifications: NotificationDto[];
    passengerCount: number | null;
}

@Component({
    selector: 'app-dashboard',
    imports: [
        DatePipe,
        MatCardModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatIconModule,
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
    private readonly flightService = inject(FlightService);
    private readonly notificationService = inject(NotificationService);
    private readonly passengerService = inject(PassengerService);

    readonly groups = signal<FlightGroup[]>([]);
    readonly loading = signal(true);
    readonly error = signal(false);

    readonly totalNotifications = computed(() =>
        this.groups().reduce((sum, g) => sum + g.notifications.length, 0),
    );

    ngOnInit(): void {
        forkJoin({
            flights: this.flightService.search(null, null),
            notifications: this.notificationService.list(),
        }).subscribe({
            next: ({ flights, notifications }) => this.buildGroups(flights, notifications),
            error: () => {
                this.loading.set(false);
                this.error.set(true);
            },
        });
    }

    private buildGroups(flights: FlightDto[], notifications: NotificationDto[]): void {
        const flightsByNumber = new Map(flights.map((f) => [f.flight_number, f]));

        // Group notifications by flight, preserving the newest-first ordering
        // that the backend / mock already returns.
        const byFlight = new Map<string, NotificationDto[]>();
        for (const notification of notifications) {
            const bucket = byFlight.get(notification.flight_number) ?? [];
            bucket.push(notification);
            byFlight.set(notification.flight_number, bucket);
        }

        const groups: FlightGroup[] = [...byFlight.entries()].map(([flightNumber, notifs]) => ({
            flightNumber,
            flight: flightsByNumber.get(flightNumber) ?? null,
            notifications: notifs,
            passengerCount: null,
        }));

        // Sort flights by their most recent notification so the latest activity
        // floats to the top.
        groups.sort(
            (a, b) =>
                new Date(b.notifications[0].created_at).getTime() -
                new Date(a.notifications[0].created_at).getTime(),
        );

        this.groups.set(groups);

        if (groups.length === 0) {
            this.loading.set(false);
            return;
        }

        // Fetch the current passenger roster only for flights that actually
        // have notifications, avoiding an unnecessary request per flight.
        forkJoin(groups.map((g) => this.passengerService.listByFlight(g.flightNumber))).subscribe({
            next: (rosters) => {
                this.groups.set(
                    groups.map((g, i) => ({ ...g, passengerCount: rosters[i].length })),
                );
                this.loading.set(false);
            },
            error: () => {
                // Notifications still render; the count just stays hidden.
                this.loading.set(false);
            },
        });
    }
}
