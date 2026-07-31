import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.checkToken()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.currentUser?.role === 'admin') {
    return true;
  }

  return router.createUrlTree(['/']);
};
