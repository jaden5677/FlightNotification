import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PassengerService } from '../../../core/passengers/passenger.service';
import { PassengerRow } from '../../../core/models/passenger.model';
import { NotificationService } from '../../../core/notifications/notification.service';
import { NotifyMessageDialog } from '../notify-message-dialog/notify-message-dialog';
import { NotifySuccessDialog } from '../notify-success-dialog/notify-success-dialog';

@Component({
    selector: 'app-passenger-list',
    imports: [DatePipe, MatCheckboxModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './passenger-list.html',
    styleUrl: './passenger-list.scss',
})
export class PassengerList implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly passengerService = inject(PassengerService);
    private readonly notificationService = inject(NotificationService);

    readonly flightNumber = this.route.snapshot.paramMap.get('flightNumber') ?? '';
    readonly passengers = signal<PassengerRow[]>([]);
    readonly selectedIds = signal<Set<number>>(new Set());
    readonly loading = signal(true);

    readonly selectedCount = computed(() => this.selectedIds().size);
    readonly allSelected = computed(
        () => this.passengers().length > 0 && this.selectedIds().size === this.passengers().length,
    );
    readonly someSelected = computed(
        () => this.selectedIds().size > 0 && !this.allSelected(),
    );

    ngOnInit(): void {
        this.passengerService.listByFlight(this.flightNumber).subscribe({
            next: (rows) => {
                this.passengers.set(rows);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    isSelected(id: number): boolean {
        return this.selectedIds().has(id);
    }

    toggleOne(id: number): void {
        const next = new Set(this.selectedIds());
        next.has(id) ? next.delete(id) : next.add(id);
        this.selectedIds.set(next);
    }

    toggleAll(checked: boolean): void {
        this.selectedIds.set(checked ? new Set(this.passengers().map((p) => p.id)) : new Set());
    }

    cancel(): void {
        this.router.navigate(['/flight-search']);
    }

    connect(): void {
        const count = this.selectedCount();
        if (count === 0) {
            return;
        }
        const messageRef = this.dialog.open(NotifyMessageDialog, {
            width: '520px',
            data: { passengerCount: count },
        });

        messageRef.afterClosed().subscribe((message?: string) => {
            if (!message) {
                return;
            }
            this.notificationService
                .send(this.flightNumber, 'OTHER', message, null)
                .subscribe(() => {
                    this.dialog.open(NotifySuccessDialog, {
                        width: '380px',
                        data: { passengerCount: count },
                    });
                });
        });
    }
}
