import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, delay, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { UserDto } from '../models/user.model';

const TOKEN_KEY = 'fn_mock_token';

const MOCK_USER: UserDto = {
    id: 'AD101',
    fName: 'Jaden',
    lName: 'Sooklal',
    email: 'jaden.sooklal@caribbean-airlines.com',
    nationality: 'Trinidad and Tobago',
    DOB: new Date('1990-01-01'),
    gender: null,
    cNumber: null,
    aType: 'ADMIN',
    specialR: null,
};

// SSR renders on the server first, where localStorage doesn't exist -
// every storage read/write here is guarded behind isPlatformBrowser.
@Injectable()
export class MockAuthService extends AuthService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    readonly isAuthenticated = signal(this.hasStoredToken());

    login(email: string, password: string): Observable<void> {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        return of(void 0).pipe(
            delay(300),
            tap(() => this.storeToken('mock-token')),
        );
    }

    // Stubbed - no Azure AD/MSAL integration exists in this codebase yet.
    // Kept as a separate method so wiring up real SSO later is a one-method swap.
    loginWithMicrosoft(): Observable<void> {
        return of(void 0).pipe(
            delay(300),
            tap(() => this.storeToken('mock-microsoft-token')),
        );
    }

    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem(TOKEN_KEY);
        }
        this.isAuthenticated.set(false);
    }

    identify(): Observable<UserDto | null> {
        return of(this.isAuthenticated() ? MOCK_USER : null).pipe(delay(150));
    }

    private storeToken(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem(TOKEN_KEY, token);
        }
        this.isAuthenticated.set(true);
    }

    private hasStoredToken(): boolean {
        return this.isBrowser && !!localStorage.getItem(TOKEN_KEY);
    }
}
