import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface NotifySuccessDialogData {
    passengerCount: number;
}

@Component({
    selector: 'app-notify-success-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './notify-success-dialog.html',
    styleUrl: './notify-success-dialog.scss',
})
export class NotifySuccessDialog {
    readonly data = inject<NotifySuccessDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<NotifySuccessDialog>);

    close(): void {
        this.dialogRef.close();
    }
}
