import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type TNavLinks = {
  links: {
    name: string;
    sectionId: string;
    href?: string;
    behaviour: string;
  }[];
};

export interface SocialMediaItem {
  name: string;
  icon: string;
  link: string;
  customClass: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @ViewChild('headerElement') headerElement!: ElementRef<HTMLElement>;
  router = inject(Router);

  navCandidates: TNavLinks = {
    links: [
      {
        name: 'FOOTER.NAV_CANDIDATE.BROWSE_OFFERS',
        sectionId: 'offers-section',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CANDIDATE.DISCOVER_STEPS',
        sectionId: 'steps-section',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CANDIDATE.LEARN_MORE_ADVANTAGES',
        sectionId: 'advantages-section',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CANDIDATE.ACCESS_FAQ',
        sectionId: 'faq-section',
        behaviour: 'scroll',
      },
    ],
  };

  navClients: TNavLinks = {
    links: [
      {
        name: 'FOOTER.NAV_CLIENT.DISCOVER_OFFER',
        sectionId: 'hero-section',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CLIENT.ANALYZE_STATISTICS',
        sectionId: 'statistique',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CLIENT.EXPLORE_SERVICES',
        sectionId: 'services',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CLIENT.CHECK_PRICING',
        sectionId: 'pricing',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CLIENT.BROWSE_PROFILES',
        sectionId: 'fiche-poste-detail',
        behaviour: 'scroll',
      },
      {
        name: 'FOOTER.NAV_CLIENT.DEFINE_JOB_DESCRIPTION',
        sectionId: 'fiche-poste',
        behaviour: 'scroll',
      },
    ],
  };

  footerItems = {
    socialMedia: [
      {
        name: 'Facebook',
        icon: 'fa fa-facebook',
        link: 'https://www.facebook.com/profile.php?id=61551056274954',
        customClass: 'bg-blue-600 text-white border-blue-600'
      },
      {
        name: 'Instagram',
        icon: 'fa fa-instagram',
        link: 'https://www.instagram.com/consult.collab/',
        customClass: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white border-pink-500'
      },
      {
        name: 'LinkedIn',
        icon: 'fa fa-linkedin',
        link: 'https://www.linkedin.com/company/consultcollab/?originalSubdomain=fr',
        customClass: 'bg-blue-700 text-white border-blue-700'
      },
      {
        name: 'Contact',
        icon: 'fa fa-envelope',
        link: 'mailto:contact@consultcollab.com',
        customClass: 'bg-red-600 text-white border-red-600'
      },
    ] as SocialMediaItem[],
  };

  currentYear = new Date().getFullYear();

  scrollToSection(sectionId: string, isClientSection: boolean = false) {
    if (isClientSection) {
      // Pour les sections client, naviguez d'abord vers la route client
      if (this.router.url !== '/client') {
        this.router.navigate(['/client']).then(() => {
          setTimeout(() => {
            this.performScroll(sectionId);
          }, 100);
        });
      } else {
        this.performScroll(sectionId);
      }
    } else {
      // Pour les sections candidat, gardez la logique existante
      if (this.router.url !== '/') {
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.performScroll(sectionId);
          }, 100);
        });
      } else {
        this.performScroll(sectionId);
      }
    }
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

  onClickLegalNotice() {
    window.scroll(0, 0);
    this.router.navigate(['/mention-legal']);
  }
  onClickCGV() {
    window.scroll(0, 0);
    this.router.navigate(['/condition-general-de-vente']);
  }
}
