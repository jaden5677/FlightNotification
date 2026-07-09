import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./features/login/login').then((m) => m.Login) },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
        children: [
            { path: '', redirectTo: 'flight-search', pathMatch: 'full' },
            {
                path: 'flight-search',
                loadComponent: () =>
                    import('./features/flight-search/flight-search').then((m) => m.FlightSearch),
            },
            {
                path: 'flight-search/:flightNumber/passengers',
                loadComponent: () =>
                    import('./features/passenger-notify/passenger-list/passenger-list').then(
                        (m) => m.PassengerList,
                    ),
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
            },
        ],
    },
    { path: '**', redirectTo: 'login' },
];
