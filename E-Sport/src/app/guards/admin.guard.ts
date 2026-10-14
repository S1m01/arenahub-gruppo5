import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Il controllo vero lo fa il backend (403): qui si evita solo di mostrare pagine inutilizzabili.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.loggato()) return router.parseUrl('/login');
  return auth.admin() ? true : router.parseUrl('/');
};
