import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { AuthService } from './core/auth/auth.service';
import { MockAuthService } from './core/auth/mock-auth.service';
import { FlightService } from './core/flights/flight.service';
import { MockFlightService } from './core/flights/mock-flight.service';
import { NotificationService } from './core/notifications/notification.service';
import { MockNotificationService } from './core/notifications/mock-notification.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    // Mocks today (see core/config/api.config.ts USE_MOCKS) - swap the
    // useClass targets to real HTTP-backed services once FN-1 is fixed up.
    { provide: AuthService, useClass: MockAuthService },
    { provide: FlightService, useClass: MockFlightService },
    { provide: NotificationService, useClass: MockNotificationService },
  ]
};
