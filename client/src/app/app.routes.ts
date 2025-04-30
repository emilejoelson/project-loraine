import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'features',
    loadComponent: () =>
      import('./features/brochure-website/brochure-website.component').then(
        (m) => m.BrochureWebsiteComponent
      ),
    children: [
      {
        title: 'Connexion',
        path: 'connexion',
        loadComponent: () =>
          import('./authentication/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        title: 'Inscription',
        path: 'inscription',
        loadComponent: () =>
          import('./authentication/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/ui/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'manage-product',
    loadComponent: () =>
      import('./features/manage-product/manage-product.component').then(
        (m) => m.ManageProductComponent
      ),
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./core/components/access-denied.component').then(
        (m) => m.AccessDeniedComponent
      ),
  },
];
