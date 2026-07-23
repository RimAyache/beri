import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Authservice } from './authentication.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(Authservice);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.clearUserData();
        router.navigateByUrl('/login');
      } else if (error.status === 404) {
        router.navigateByUrl('/not-found');
      }

      return throwError(() => error);
    }),
  );
};
