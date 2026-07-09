import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

import { USE_MOCKS } from './core/config/api.config';
import { authInterceptor } from './core/auth/auth.interceptor';

import { AuthService } from './core/auth/auth.service';
import { MockAuthService } from './core/auth/mock-auth.service';
import { HttpAuthService } from './core/auth/http-auth.service';
import { FlightService } from './core/flights/flight.service';
import { MockFlightService } from './core/flights/mock-flight.service';
import { HttpFlightService } from './core/flights/http-flight.service';
import { PassengerService } from './core/passengers/passenger.service';
import { MockPassengerService } from './core/passengers/mock-passenger.service';
import { HttpPassengerService } from './core/passengers/http-passenger.service';
import { NotificationService } from './core/notifications/notification.service';
import { MockNotificationService } from './core/notifications/mock-notification.service';
import { HttpNotificationService } from './core/notifications/http-notification.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    // Real HTTP services against the Flask backend; set USE_MOCKS=true in
    // core/config/api.config.ts to run fully offline against the mocks instead.
    { provide: AuthService, useClass: USE_MOCKS ? MockAuthService : HttpAuthService },
    { provide: FlightService, useClass: USE_MOCKS ? MockFlightService : HttpFlightService },
    { provide: PassengerService, useClass: USE_MOCKS ? MockPassengerService : HttpPassengerService },
    {
      provide: NotificationService,
      useClass: USE_MOCKS ? MockNotificationService : HttpNotificationService,
    },
  ],
};
