import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router); // Necesario para redireccionar

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        // No autenticado: redirigir al login
        router.navigate(['/login']);
      } else if (err.status === 403) {
        // No autorizado: redirigir o mostrar error
        alert('No tienes permiso para acceder a este recurso');
        router.navigate(['/']);
      }
      return throwError(() => err);
    })
  );
};
  