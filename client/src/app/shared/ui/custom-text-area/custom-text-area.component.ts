import { Component, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-text-area',
  imports: [ReactiveFormsModule,TranslateModule],
  templateUrl: './custom-text-area.component.html',
  styleUrl: './custom-text-area.component.scss'
})
export class CustomTextAreaComponent implements OnInit{
    @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) id: string = '';
  @Input({ required: true }) classTextarea: string = '';
  @Input({ required: true }) classLabel: string = '';
  @Input({ required: true }) title: string = '';
  @Input() rows: number = 3; 
  @Input() cols: number = 30; 

  @Input() control?: AbstractControl | null;

  constructor(@Optional() private controlContainer: ControlContainer) {}

  ngOnInit() {
    if (this.controlContainer) {
      this.control = this.controlContainer.control?.get(this.id);
    }
  }
}
