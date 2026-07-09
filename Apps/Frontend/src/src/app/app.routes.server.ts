import { RenderMode, ServerRoute } from '@angular/ssr';

// This app is an entirely client-driven admin portal - every route sits
// behind authGuard and reads client-only auth state (localStorage-backed
// mock token), so prerendering doesn't apply. Render everything client-side;
// swap specific routes back to Server/Prerender later if that changes.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
