// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { TokenService } from '../../authentication/data-access/services/token.service';
import { AuthService } from '../../authentication/data-access/services/auth.service';
import { inject } from '@angular/core';

// Moved outside the function to maintain state between requests
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Use inject to get services
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Skip token addition for refresh token and login endpoints
  if (shouldSkipToken(request.url)) {
    return next(request);
  }

  // Add token to request if available
  const token = tokenService.getAccessToken();
  if (token) {
    request = addTokenHeader(request, token);
  }

  return next(request).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(request, next, tokenService, authService);
      }
      return throwError(() => error);
    })
  );
};

// Helper functions
function shouldSkipToken(url: string): boolean {
  return url.includes('/auth/login') || 
         url.includes('/auth/refresh-token') || 
         url.includes('/auth/register');
}

function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  authService: AuthService
) {
  // Only try refresh if we have a refresh token
  if (!tokenService.getRefreshToken()) {
    return throwError(() => new Error('No refresh token available'));
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    
    return authService.refreshToken().pipe(
      switchMap(success => {
        isRefreshing = false;
        
        if (success) {
          refreshTokenSubject.next(success);
          const newToken = tokenService.getAccessToken();
          return next(addTokenHeader(request, newToken!));
        }
        
        // If refresh fails, return the original error
        return throwError(() => new Error('Session expired'));
      }),
      catchError(err => {
        isRefreshing = false;
        // Don't automatically logout here - let the component handle it
        return throwError(() => err);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => {
        const newToken = tokenService.getAccessToken();
        if (newToken) {
          return next(addTokenHeader(request, newToken));
        }
        // If somehow we don't have a token after refresh completed
        return throwError(() => new Error('Authentication failed'));
      })
    );
  }
}