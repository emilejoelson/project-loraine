import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { AuthService } from '../../data-access/services/auth.service';
import { LoginRequest } from './models/login';
import { AuthResponse } from '../../data-access/models/auth.response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API_URL = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, loginData)
      .pipe(
        tap(response => this.authService.handleAuthentication(response)),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
}