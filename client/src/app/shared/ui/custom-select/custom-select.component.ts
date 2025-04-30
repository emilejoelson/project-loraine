import { Component, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-select',
  imports: [ReactiveFormsModule,TranslateModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
})
export class CustomSelectComponent implements OnInit{
    @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) id: string = '';
  @Input({ required: true }) classSelect: string = '';
  @Input({ required: true }) classLabel: string = '';
  @Input({ required: true }) title: string = '';
  @Input() options: { value: string; label: string }[] = [];

  @Input() control?: AbstractControl | null;

  constructor(@Optional() private controlContainer: ControlContainer) {}

  ngOnInit() {
    if (this.controlContainer) {
      this.control = this.controlContainer.control?.get(this.id);
    }
  }
}
