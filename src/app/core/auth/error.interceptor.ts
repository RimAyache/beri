import { inject } from '@angular/core';
import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { endpoint } from './endpoints';

export const SKIP_REFRESH = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthEndpoint =
    req.url.includes(endpoint.refresh) ||
    req.url.includes(endpoint.login) ||
    req.url.includes(endpoint.register);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint && !req.context.get(SKIP_REFRESH)) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${response.token}`),
              context: req.context.set(SKIP_REFRESH, true),
            });
            return next(retryReq);
          }),
          catchError(() => {
            authService.clearUserData();
            router.navigateByUrl('/login');
            return throwError(() => error);
          }),
        );
      }

      if (error.status === 401) {
        authService.clearUserData();
        router.navigateByUrl('/login');
      } else if (error.status === 404 && req.method === 'GET') {
        router.navigateByUrl('/not-found');
      }

      return throwError(() => error);
    }),
  );
};
