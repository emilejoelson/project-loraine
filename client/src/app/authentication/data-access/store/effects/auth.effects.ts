import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  tap,
  mergeMap,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthActions } from '../actions/auth.actions';
import { SignupService } from '../../../signup/data-access/signup.service';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { LoginService } from '../../../login/data-access/login.service';
import { User } from '../../../signup/data-access/models/user';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  signupService = inject(SignupService);
  loginService = inject(LoginService);
  authService = inject(AuthService);
  tokenService = inject(TokenService);

  router = inject(Router);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap((payload) => {
        // Process image if available
        if (payload.profileImage && payload.profileImage.includes('base64')) {
          // Convert base64 to file
          const base64 = payload.profileImage.split(',')[1];
          const blob = this.base64ToBlob(base64, 'image/jpeg');
          const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

          // First upload the image
          return this.signupService.uploadProfileImage(file).pipe(
            switchMap((imageResponse) => {
              // Then do the signup with the image path
              const signupData = {
                ...payload,
                profileImage: imageResponse.filePath,
              };

              return this.signupService.signup(signupData).pipe(
                map((response) => AuthActions.signupSuccess({ response })),
                catchError((error) => of(AuthActions.signupFailure({ error })))
              );
            }),
            catchError((error) =>
              of(AuthActions.uploadProfileImageFailure({ error }))
            )
          );
        } else {
          // Just do the signup without image upload
          return this.signupService.signup(payload).pipe(
            map((response) => AuthActions.signupSuccess({ response })),
            catchError((error) => of(AuthActions.signupFailure({ error })))
          );
        }
      })
    )
  );

  uploadProfileImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.uploadProfileImage),
      switchMap(({ file }) =>
        this.signupService.uploadProfileImage(file).pipe(
          map((response) =>
            AuthActions.uploadProfileImageSuccess({
              filePath: response.filePath,
            })
          ),
          catchError((error) =>
            of(AuthActions.uploadProfileImageFailure({ error }))
          )
        )
      )
    )
  );

  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(({ response }) => {
          // Store tokens in localStorage
          this.tokenService.setAccessToken(response.accessToken);
          this.tokenService.setRefreshToken(response.refreshToken);

          // Process user data through auth service
          this.authService.handleAuthentication(response);

          // Navigate to dashboard after successful signup
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
            window.scrollTo(0, 0);
          }, 1500);
        })
      ),
    { dispatch: false }
  );

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((loginRequest) =>
        this.loginService.login(loginRequest).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          // Store tokens in localStorage
          this.tokenService.setAccessToken(response.accessToken);
          this.tokenService.setRefreshToken(response.refreshToken);

          // Process user data through auth service
          this.authService.handleAuthentication(response);

          setTimeout(() => {
            this.router.navigate(['/manage-product']);
            window.scrollTo(0, 0);
          }, 1000);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        switchMap(() =>
          this.authService.logout().pipe(
            tap(() => {
              this.tokenService.removeAccessToken();
              this.tokenService.removeRefreshToken();
              this.router.navigate(['/features/connexion']);
            }),
            catchError((error) => {
              console.error('Error during logout:', error);
              this.tokenService.removeAccessToken();
              this.tokenService.removeRefreshToken();
              this.router.navigate(['/features/connexion']);
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserProfile),
      switchMap(() =>
        this.authService.getUserProfile().pipe(
          map((profile) => AuthActions.loadUserProfileSuccess({ profile })),
          catchError((error) =>
            of(AuthActions.loadUserProfileFailure({ error }))
          )
        )
      )
    )
  );

  loadProfileAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => AuthActions.loadUserProfile())
    )
  );

  clearProfileAfterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => AuthActions.clearUserProfile())
    )
  );

  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      switchMap(() => {
        // Check if we have tokens
        const hasToken = this.tokenService.hasToken();
        const isExpired = this.tokenService.isTokenExpired();

        if (!hasToken || isExpired) {
          // No valid token, no need to initialize
          return of(
            AuthActions.initializeAuthFailure({
              error: 'No valid token',
            })
          );
        }

        // Get basic user info from token
        const payload = this.tokenService.getTokenPayload();
        if (!payload) {
          return of(
            AuthActions.initializeAuthFailure({
              error: 'Invalid token payload',
            })
          );
        }

        // Create basic user from token
        const user: User = {
          id: payload.userId || payload.sub,
          email: payload.email || '',
          role: payload.role || null,
          roles: payload.roles || [],
        };

        // Then fetch full user profile
        return this.authService.getUserProfile().pipe(
          map((profile) =>
            AuthActions.initializeAuthSuccess({
              user,
              profile,
            })
          ),
          catchError((error) => {
            // If 401, try to refresh the token once
            if (error?.status === 401) {
              return this.authService.refreshToken().pipe(
                switchMap((refreshSuccess) => {
                  if (refreshSuccess) {
                    // Token refreshed, try getting profile again
                    return this.authService.getUserProfile().pipe(
                      map((profile) =>
                        AuthActions.initializeAuthSuccess({
                          user,
                          profile,
                        })
                      ),
                      catchError((err) =>
                        of(
                          AuthActions.initializeAuthFailure({
                            error: err,
                          })
                        )
                      )
                    );
                  } else {
                    return of(
                      AuthActions.initializeAuthFailure({
                        error: 'Token refresh failed',
                      })
                    );
                  }
                }),
                catchError((err) =>
                  of(
                    AuthActions.initializeAuthFailure({
                      error: err,
                    })
                  )
                )
              );
            }

            return of(AuthActions.initializeAuthFailure({ error }));
          })
        );
      })
    )
  );
}
