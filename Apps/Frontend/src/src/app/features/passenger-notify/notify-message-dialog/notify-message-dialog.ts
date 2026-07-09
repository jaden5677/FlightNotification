import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface NotifyMessageDialogData {
    passengerCount: number;
}

@Component({
    selector: 'app-notify-message-dialog',
    imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './notify-message-dialog.html',
    styleUrl: './notify-message-dialog.scss',
})
export class NotifyMessageDialog {
    readonly data = inject<NotifyMessageDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<NotifyMessageDialog>);

    message = '';

    cancel(): void {
        this.dialogRef.close();
    }

    send(): void {
        this.dialogRef.close(this.message);
    }
}
