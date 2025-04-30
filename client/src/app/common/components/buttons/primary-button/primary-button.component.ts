import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

type TInput = {
  name?: string;
  href?: string;
  action?: (args?: any) => void;
  behaviour: 'button' | 'link';
};
@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './primary-button.component.html',
})
export class PrimaryButtonComponent {
  @Input({ required: true }) buttonData!: TInput;
}
