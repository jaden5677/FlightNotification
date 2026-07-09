import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenStore } from './token-store';
import { UserDto, LoginResponse } from '../models/user.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable()
export class HttpAuthService extends AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenStore = inject(TokenStore);

    readonly isAuthenticated = signal(!!this.tokenStore.get());

    login(email: string, password: string): Observable<void> {
        return this.http
            .post<LoginResponse>(`${API_BASE_URL}/api/login`, { email, password })
            .pipe(
                tap((res) => {
                    this.tokenStore.set(res.access_token);
                    this.isAuthenticated.set(true);
                }),
                map(() => void 0),
            );
    }

    // No Azure AD/MSAL backend exists; kept as a stub so the button is wired.
    loginWithMicrosoft(): Observable<void> {
        return of(void 0);
    }

    logout(): void {
        this.tokenStore.clear();
        this.isAuthenticated.set(false);
    }

    identify(): Observable<UserDto | null> {
        return this.http.get<UserDto>(`${API_BASE_URL}/api/identify`);
    }
}
