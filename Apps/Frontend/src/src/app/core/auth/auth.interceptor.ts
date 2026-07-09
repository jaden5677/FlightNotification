import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenStore } from './token-store';

// Attaches the stored JWT as `Authorization: Bearer <token>` to backend API
// calls so the @jwt_required() Flask routes accept them.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(TokenStore).get();
    if (token && req.url.includes('/api/')) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next(req);
};
