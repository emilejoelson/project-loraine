import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = localStorage.getItem('language') || 'EN';
    this.translate.setDefaultLang('EN');

    this.translate.use(this.currentLang).subscribe(() => {
      console.log(`Language switched to: ${this.currentLang}`);
    }, (error) => {
      console.error('Error loading translations:', error);
    });
  }

  switchLanguage(lang: 'EN' | 'FR') {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  getCurrentLang() {
    return this.currentLang;
  }
}
