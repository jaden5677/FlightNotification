import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'fn_token';

// SSR-safe JWT storage shared by HttpAuthService (writes) and the auth
// interceptor (reads). On the server there is no localStorage, so every
// access is guarded behind isPlatformBrowser.
@Injectable({ providedIn: 'root' })
export class TokenStore {
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    get(): string | null {
        return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
    }

    set(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem(TOKEN_KEY, token);
        }
    }

    clear(): void {
        if (this.isBrowser) {
            localStorage.removeItem(TOKEN_KEY);
        }
    }
}
