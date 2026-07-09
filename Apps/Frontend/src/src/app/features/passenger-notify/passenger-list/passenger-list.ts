import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../core/notifications/notification.service';
import { NotifyMessageDialog } from '../notify-message-dialog/notify-message-dialog';
import { NotifySuccessDialog } from '../notify-success-dialog/notify-success-dialog';

// Table shell only: the real backend has no passenger/customer data model and
// no per-passenger recipient list for a flight (Notification is scoped to the
// whole flight, not individual passengers) - so this page renders the Figma
// column layout with no data source behind it. The demo button below exists
// purely so the message/success dialogs remain reachable for visual QA.
@Component({
    selector: 'app-passenger-list',
    imports: [MatCheckboxModule, MatButtonModule],
    templateUrl: './passenger-list.html',
    styleUrl: './passenger-list.scss',
})
export class PassengerList {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly notificationService = inject(NotificationService);

    readonly flightNumber = this.route.snapshot.paramMap.get('flightNumber') ?? '';

    cancel(): void {
        this.router.navigate(['/flight-search']);
    }

    // Demo-only trigger: no passenger selection exists yet, so this simulates
    // a fixed count to exercise the dialog flow end-to-end.
    openNotifyDemo(): void {
        const demoPassengerCount = 4;
        const messageRef = this.dialog.open(NotifyMessageDialog, {
            data: { passengerCount: demoPassengerCount },
        });

        messageRef.afterClosed().subscribe((message?: string) => {
            if (!message) {
                return;
            }
            this.notificationService
                .send(this.flightNumber, 'OTHER', message, null)
                .subscribe(() => {
                    this.dialog.open(NotifySuccessDialog, {
                        data: { passengerCount: demoPassengerCount },
                    });
                });
        });
    }
}
