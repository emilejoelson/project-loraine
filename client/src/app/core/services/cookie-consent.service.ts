import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly COOKIE_KEY = 'cookie-consent-status';
  private consentStatusSource = new BehaviorSubject<boolean>(this.getConsentStatus());
  consentStatus$ = this.consentStatusSource.asObservable();

  constructor() {}

  private getConsentStatus(): boolean {
    return localStorage.getItem(this.COOKIE_KEY) === 'accepted';
  }

  acceptCookies(preferences: { analytics: boolean; marketing: boolean; necessary: boolean }): void {
    localStorage.setItem(this.COOKIE_KEY, 'accepted');
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    this.consentStatusSource.next(true);
  }

  declineCookies(): void {
    localStorage.setItem(this.COOKIE_KEY, 'declined');
    localStorage.setItem('cookie-preferences', JSON.stringify({
      analytics: false,
      marketing: false,
      necessary: true
    }));
    this.consentStatusSource.next(true);
  }

  resetConsent(): void {
    localStorage.removeItem(this.COOKIE_KEY);
    localStorage.removeItem('cookie-preferences');
    this.consentStatusSource.next(false);
  }
}
