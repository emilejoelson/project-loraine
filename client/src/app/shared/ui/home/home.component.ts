import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  router = inject(Router);
  singup() {
    this.router.navigate(['/features/inscription']);
    window.scrollTo(0, 0);
  }
  login() {
    this.router.navigate(['/features/connexion']);
    window.scrollTo(0, 0);
  }
}
