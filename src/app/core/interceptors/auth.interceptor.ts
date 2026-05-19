import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (!isPrivateApi(req.url)) {
    return next(req);
  }

  return from(auth.getIdToken()).pipe(
    switchMap((token) => {
      if (!token) return next(req);

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    }),
  );
};

function isPrivateApi(url: string): boolean {
  return url.includes('/bookings') || url.includes('/checkin');
}
