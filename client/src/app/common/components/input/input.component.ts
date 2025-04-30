import { Component, Input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TField } from '../../model/field';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() fieldData!: TField;
  @Input() formGroup!: FormGroup;
  @Input() isFormSubmited!: boolean;
  @Input() className: string = '';
  isPasswordVisible: boolean = false;
  private isFocus = false;

  togglePasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onFoucs() {
    this.isFocus = true;
  }

  onBlur() {
    this.isFocus = false;
  }

  get isValidToShowError() {
    const isFieldValid =
      this.formGroup.get(this.fieldData.formControlName)?.valid === true;
    const isFieldToched =
      this.formGroup.get(this.fieldData.formControlName)?.touched === true;

    return (
      (!isFieldValid && isFieldToched && !this.isFocus) ||
      (!isFieldValid && this.isFormSubmited && !this.isFocus)
    );
  }
}
