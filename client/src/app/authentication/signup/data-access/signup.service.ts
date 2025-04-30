import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { AuthResponse } from '../../data-access/models/auth.response';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signup(signupData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/signup`,
      signupData
    );
  }

  uploadProfileImage(file: File): Observable<{filePath: string}> {
    const formData = new FormData();
    formData.append('profileImage', file);
    return this.http.post<{ filePath: string }>(
      `${this.API_URL}/upload-profile-image`,
      formData
    );
  }
}
