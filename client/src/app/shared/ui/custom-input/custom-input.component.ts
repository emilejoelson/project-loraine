import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-input',
  imports: [ReactiveFormsModule,TranslateModule,CommonModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
})
export class CustomInputComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input({ required: true }) id: string = '';
  @Input({ required: true }) classInput: string = '';
  @Input({ required: true }) classLabel: string = '';
  @Input({ required: true }) title: string = '';
  @Input() type :string = '';
  @Input() control?: AbstractControl | null;
  @Input() placeholder: string = '';
  @Input() hasTogglePassword: boolean = false;

  constructor(@Optional() private controlContainer: ControlContainer) {}
  @Output() togglePassword = new EventEmitter<void>();
  
  onTogglePassword(): void {
    this.togglePassword.emit();
  }
  ngOnInit() {
    if (this.controlContainer) {
      this.control = this.controlContainer.control?.get(this.id);
    }
  }
  onNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.type === 'number') {
      const value = input.value;
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        this.control?.setValue(numValue, { emitEvent: true });
      }
    }
  }
}
