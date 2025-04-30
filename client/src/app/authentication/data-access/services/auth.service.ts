import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from '../../../../environment/environment';
import { User } from '../../signup/data-access/models/user';
import { AuthResponse, UserProfileResponse } from '../models/auth.response';
import { RefreshTokenResponse } from '../../login/data-access/models/token';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/selectors/auth.selectors';
import { AuthActions } from '../store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  
  // Keep a local BehaviorSubject for compatibility with existing code
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private store = inject(Store);
  
  constructor() {
    // Subscribe to store updates to keep local subject in sync
    this.store.select(selectUser).subscribe(user => {
      if (user && user !== this.currentUserSubject.value) {
        this.currentUserSubject.next(user);
      }
    });
  }

  // Get full user profile from API
  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.API_URL}/user/profile`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return throwError(() => error);
        })
      );
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const hasToken = this.tokenService.hasToken();
    const isExpired = this.tokenService.isTokenExpired();
    return hasToken && !isExpired;
  }

  handleAuthentication(response: AuthResponse) {
    // Store both tokens
    this.tokenService.setAccessToken(response.accessToken);
    if (response.refreshToken) {
      this.tokenService.setRefreshToken(response.refreshToken);
    }

    const payload = this.tokenService.getTokenPayload();
    const email = payload?.email || '';

    const user: User = {
      id: response.userId,
      email: email,
      role: response.role,
      roles: response.roles
    };
    
    // Set user in local subject for immediate access
    this.currentUserSubject.next(user);
  }

  refreshToken(): Observable<boolean> {
    const refreshToken = this.tokenService.getRefreshToken();
    
    if (!refreshToken) {
      return of(false);
    }
    
    console.log('Attempting to refresh token');
    
    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/auth/refresh-token`, {
      refreshToken: refreshToken
    })
      .pipe(
        map(response => {
          console.log('Token refreshed successfully');
          this.tokenService.setAccessToken(response.accessToken);
          if (response.refreshToken) {
            this.tokenService.setRefreshToken(response.refreshToken);
          }
          return true;
        }),
        catchError(error => {
          console.error('Token refresh failed:', error);
          return of(false);
        })
      );
  }

  logout(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    
    if (!refreshToken) {
      this.clearAuthData();
      return of(null);
    }
    
    return this.http.post(`${this.API_URL}/auth/logout`, {
      refreshToken: refreshToken
    }, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  // Regular logout that clears data and notifies
  private clearAuthData() {
    console.log('Clearing auth data');
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    // Dispatch logout action to store
    this.store.dispatch(AuthActions.logout());
  }
  
  hasRole(roleName: string): boolean {
    const user = this.currentUser;
    if (!user) return false;
  
    if (user.role === roleName) return true;
    
    return !!user.roles?.some(role => role.name === roleName);
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}