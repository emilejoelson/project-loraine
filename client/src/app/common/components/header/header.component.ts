// TypeScript (header.component.ts)
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthActions } from '../../../authentication/data-access/store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../state/root.state';
import {
  selectFullName,
  selectIsAuthenticated,
  selectProfileImage,
  selectUser,
  selectUserEmail,
  selectUserProfile,
} from '../../../authentication/data-access/store/selectors/auth.selectors';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../../authentication/signup/data-access/models/user';

type TNavLinks = {
  links: {
    name: string;
    translationKey: string;
    sectionId: string;
    href?: string;
    behaviour: string;
  }[];
  buttons: {
    name: string;
    translationKey: string;
  }[];
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('headerElement') headerElement!: ElementRef<HTMLElement>;
  @ViewChild('progressBarElement')
  progressBarElement!: ElementRef<HTMLDivElement>;
  @ViewChildren('navElement') navElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('logoImage') logoImage!: ElementRef<HTMLImageElement>;
  @ViewChild('logoContainer') logoContainer!: ElementRef<HTMLDivElement>;

  isNavOpen = false;
  currentRoute: string = '';
  dropdownOpen: boolean = false;
  dropdonwOpenSetting: boolean = false;
  isProfileMenuOpen: boolean = false;

  private destroy$ = new Subject<void>();

  // Authentication and profile related observables
  isAuthenticated$: Observable<boolean>;
  userProfile$: Observable<Partial<User> | null>;
  profileImageUrl$: Observable<string>;
  fullName$: Observable<string>;
  userEmail$: Observable<string>;

  getInitials(fullName: string | null): string {
    if (!fullName) return '';

    const nameParts = fullName.split(' ');

    return nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
  }

  toggleDropdownOpen() {
    this.dropdonwOpenSetting = !this.dropdonwOpenSetting;
    if (this.dropdonwOpenSetting) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.dropdownOpen = false;
    }
  }

  currentLanguage: 'FR' | 'EN' = 'EN';

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private store: Store<State>
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    this.currentLanguage = this.translationService.getCurrentLang() as
      | 'FR'
      | 'EN';

    // Subscribe to authentication state
this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
 // Original selectors - keep these
this.userProfile$ = this.store.select(selectUserProfile);
this.profileImageUrl$ = this.store.select(selectProfileImage);
this.fullName$ = this.store.select(selectFullName);
this.userEmail$ = this.store.select(selectUserEmail);

// Add subscriptions for debugging
this.userEmail$.pipe(
  takeUntil(this.destroy$) // Assuming you have a destroy$ Subject for cleanup
).subscribe(email => {
  console.log('User Email Value:', email);
});

this.fullName$.pipe(
  takeUntil(this.destroy$)
).subscribe(name => {
  console.log('Full Name Value:', name);
});

this.profileImageUrl$.pipe(
  takeUntil(this.destroy$)
).subscribe(imageUrl => {
  console.log('Profile Image URL:', imageUrl);
});

this.userProfile$.pipe(
  takeUntil(this.destroy$)
).subscribe(profile => {
  console.log('Complete User Profile:', profile);
});

// Alternative approach using combineLatest if you want to log everything together
combineLatest([
  this.userEmail$,
  this.fullName$,
  this.profileImageUrl$,
  this.userProfile$
]).pipe(
  takeUntil(this.destroy$)
).subscribe(([email, fullName, imageUrl, profile]) => {
  console.log('--- User Data Debug ---');
  console.log('Email:', email);
  console.log('Name:', fullName);
  console.log('Image:', imageUrl);
  console.log('Profile:', profile);
  console.log('---------------------');
});

    combineLatest([this.isAuthenticated$])
      .pipe(map(([isAuthenticated]) => isAuthenticated))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.store.dispatch(AuthActions.loadUserProfile());
        }
      });
  }

  switchLanguage(lang: 'FR' | 'EN') {
    this.translationService.switchLanguage(lang);
    this.currentLanguage = lang;
    this.dropdownOpen = false;
  }

  navItems: TNavLinks = {
    links: [
      {
        name: 'Offres',
        translationKey: 'HEADER.OFFRES',
        sectionId: 'offers-section',
        behaviour: 'scroll',
      },
      {
        name: 'Etapes',
        translationKey: 'HEADER.ETAPES',
        sectionId: 'steps-section',
        behaviour: 'scroll',
      },
      {
        name: 'Avantages',
        translationKey: 'HEADER.AVANTAGES',
        sectionId: 'advantages-section',
        behaviour: 'scroll',
      },
      {
        name: 'FAQ',
        translationKey: 'HEADER.FAQ',
        sectionId: 'faq-section',
        behaviour: 'scroll',
      },
      {
        name: 'Contact',
        translationKey: 'HEADER.CONTACT',
        sectionId: 'contact-section',
        behaviour: 'scroll',
      },
    ],
    buttons: [
      {
        name: 'Client',
        translationKey: 'HEADER.CLIENT',
      },
      {
        name: 'Postuler maintenant',
        translationKey: 'HEADER.POSTULER_MAINTENANT',
      },
    ],
  };

  logout() {
    console.log('Logging out...');
    this.store.dispatch(AuthActions.logout());
    this.isProfileMenuOpen = false;
  }

  onDeposit() {
    this.isNavOpen = false;
    this.router.navigate(['/deposer-un-cv']);
    window.scrollTo(0, 0);
  }

  onSignup() {
    this.isNavOpen = false;
    this.router.navigate(['/inscription']);
    window.scrollTo(0, 0);
    this.toggleProfileMenu();
  }

  onLogin() {
    this.isNavOpen = false;
    this.router.navigate(['/connexion']);
    window.scrollTo(0, 0);
    this.toggleProfileMenu();
  }

  onClient() {
    this.isNavOpen = false;
    this.router.navigate(['/client']);
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    this.toggleHeaderBackground();
    this.updateProgressBar();
  }

  scrollToSection(sectionId: string) {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.performScroll(sectionId);
        }, 100);
      });
    } else {
      this.performScroll(sectionId);
    }
    this.isNavOpen = false;
  }

  private performScroll(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = this.headerElement.nativeElement.offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  @HostListener('window:scroll')
  scrollHandler() {
    this.toggleHeaderBackground();
    this.updateProgressBar();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    if (this.isProfileMenuOpen && !event.target) {
      this.isProfileMenuOpen = false;
    }

    if (this.dropdownOpen && !event.target) {
      this.dropdownOpen = false;
    }
  }

  toggleHeaderBackground() {
    if (typeof window === 'undefined') {
      return;
    }
    const top = window.scrollY;
    if (top > 0) {
      this.headerElement.nativeElement.style.background = 'white';
      this.headerElement.nativeElement.style.boxShadow =
        'rgba(17, 17, 26, 0.1) 0px 1px 0px';

      this.headerElement.nativeElement.classList.remove('min-h-[100px]');
      this.headerElement.nativeElement.classList.add('min-h-[70px]');

      this.navElements.forEach((navElement) => {
        navElement.nativeElement.classList.remove('text-gray-100');
        navElement.nativeElement.classList.add('text-gray-600');
      });
    } else {
      this.headerElement.nativeElement.style.background = 'transparent';
      this.headerElement.nativeElement.style.boxShadow = 'none';

      this.headerElement.nativeElement.classList.add('min-h-[100px]');
      this.headerElement.nativeElement.classList.remove('min-h-[70px]');

      this.navElements.forEach((navElement) => {
        navElement.nativeElement.classList.remove('text-gray-600');
        navElement.nativeElement.classList.add('text-gray-100');
      });
    }
  }

  updateProgressBar() {
    if (typeof window === 'undefined') {
      return;
    }
    const top = window.scrollY;
    const pageHeight = window.document.body.scrollHeight - window.innerHeight;
    const progressBarWidth = (top / Math.max(1, pageHeight)) * 100;

    if (top > 0) {
      this.progressBarElement.nativeElement.style.opacity = '1';
    } else {
      this.progressBarElement.nativeElement.style.opacity = '0';
    }

    this.progressBarElement.nativeElement.style.width = `${progressBarWidth}%`;
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }
}
