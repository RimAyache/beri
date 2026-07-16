import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        router.navigateByUrl('/login');
      } else if (error.status === 404) {
        router.navigateByUrl('/not-found');
      }

      return throwError(() => error);
    }),
  );
};
