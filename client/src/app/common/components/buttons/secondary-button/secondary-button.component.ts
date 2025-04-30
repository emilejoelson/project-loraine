import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

type TInput = {
  name?: string;
  href?: string;
  action?: (args?: any) => void;
  behaviour: 'button' | 'link';
};

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './secondary-button.component.html',
})
export class SecondaryButtonComponent {
  @Input({ required: true }) buttonData!: TInput;
}
