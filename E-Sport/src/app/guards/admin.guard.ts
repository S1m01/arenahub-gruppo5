import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.verifica().pipe(
    map((loggato) => {
      if (!loggato) return router.parseUrl('/login');
      return auth.admin() ? true : router.parseUrl('/');
    })
  );
};
