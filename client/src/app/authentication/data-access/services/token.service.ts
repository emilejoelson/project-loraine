import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  
  constructor() {}

  setAccessToken(token: string): void {
    if (token) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    if (token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      
      // Add a 30-second buffer to avoid edge cases
      return Date.now() >= (expiryTime - 30000);
    } catch (e) {
      console.error('Error parsing token:', e);
      // Don't consider token expired on parsing error
      // This prevents logout loops on invalid tokens
      return false;
    }
  }

  getTokenPayload(): any {
    const token = this.getAccessToken();
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error parsing token payload:', e);
      return null;
    }
  }

  // Helper method to check user role from token
  hasRole(role: string): boolean {
    const payload = this.getTokenPayload();
    if (!payload) return false;
    
    // Check based on different possible role properties in the JWT
    if (payload.role && payload.role === role) {
      return true;
    }
    
    if (payload.roles && Array.isArray(payload.roles)) {
      return payload.roles.includes(role);
    }
    
    return false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }
}