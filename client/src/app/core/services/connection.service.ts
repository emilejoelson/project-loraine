import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, fromEvent, map, merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private platformId = inject(PLATFORM_ID);
  private online$ = new BehaviorSubject<boolean>(this.getInitialStatus());
  public connectionStatus$: Observable<boolean> = this.online$.asObservable();

  private getInitialStatus(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return navigator.onLine;
    }
    return true;
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Set up browser-only event listeners
      merge(
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false)),
        // Add DOMContentLoaded event to check status after page load
        fromEvent(document, 'DOMContentLoaded').pipe(map(() => navigator.onLine))
      ).subscribe(status => {
        this.online$.next(status);
      });

      // Additional check on window load
      window.addEventListener('load', () => {
        this.online$.next(navigator.onLine);
      });
    }
  }
}
