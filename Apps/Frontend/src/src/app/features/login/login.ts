import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    readonly email = signal('');
    readonly password = signal('');
    readonly submitting = signal(false);
    readonly error = signal<string | null>(null);

    submit(): void {
        this.submitting.set(true);
        this.error.set(null);
        this.auth.login(this.email(), this.password()).subscribe({
            next: () => {
                this.submitting.set(false);
                this.router.navigate(['/flight-search']);
            },
            error: () => {
                this.submitting.set(false);
                this.error.set('Invalid email or password.');
            },
        });
    }

    // Stub only - no Azure AD/MSAL integration exists in the backend yet.
    continueWithMicrosoft(): void {
        this.submitting.set(true);
        this.error.set(null);
        this.auth.loginWithMicrosoft().subscribe({
            next: () => {
                this.submitting.set(false);
                this.router.navigate(['/flight-search']);
            },
            error: () => {
                this.submitting.set(false);
                this.error.set('Microsoft sign-in is not available yet.');
            },
        });
    }
}
