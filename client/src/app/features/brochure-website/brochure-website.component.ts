import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { HeaderComponent } from '../../common/components/header/header.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { LoginComponent } from '../../authentication/login/login.component';

@Component({
  selector: 'app-brochure-website',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    LoginComponent
  ],
  templateUrl: './brochure-website.component.html',
  styleUrl: './brochure-website.component.scss',
})
export class BrochureWebsiteComponent {

}
