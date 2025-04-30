import { Component } from '@angular/core';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';

type TButtonData = {
  name: string;
  href: string;
  behaviour: 'link' | 'button';
};

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [SecondaryButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  buttonData: TButtonData = {
    name: "Retourner à l'accueil",
    href: '/',
    behaviour: 'link',
  };
}
