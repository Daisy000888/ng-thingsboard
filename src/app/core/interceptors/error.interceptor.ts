import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from "../services/auth/auth.service";
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        tap({
          error: error => {
            // TODO: Log error
            // console.error('ErrorInterceptor', err.error)

            // TODO: Show toast notification

            switch (error.status) {
              case 401: {
                this.error401Handler();
                break;
              }
              default: {
                break;
              }
            }
          }
        })

        /* catchError(error => {
          // Handle error
          return throwError(error)
        }), */
      );
  }

  error401Handler() {
    // Auto logout if 401 response returned from api
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

}
