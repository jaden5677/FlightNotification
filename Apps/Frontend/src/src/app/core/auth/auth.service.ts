import { Observable } from 'rxjs';
import { Injectable, Signal } from '@angular/core';
import { UserDto } from '../models/user.model';

// Abstract DI token. Provide MockAuthService today; swap to a real
// HttpClient-backed implementation once the FN-1 backend actually boots,
// with no changes needed in any component that injects AuthService.
@Injectable()
export abstract class AuthService {
    abstract readonly isAuthenticated: Signal<boolean>;
    abstract login(email: string, password: string): Observable<void>;
    abstract loginWithMicrosoft(): Observable<void>;
    abstract logout(): void;
    abstract identify(): Observable<UserDto | null>;
}
