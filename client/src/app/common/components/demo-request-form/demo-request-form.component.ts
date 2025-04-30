import { Component, Input, WritableSignal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TField } from '../../model/field';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-demo-request-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './demo-request-form.component.html',
  styleUrl: './demo-request-form.component.scss',
})
export class DemoRequestFormComponent {
  requestDemoFormGroup = new FormGroup({
    fName: new FormControl('', Validators.required),
    lName: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
  });

  formFields: TField[] = [
    {
      label: 'Prénom',
      isRequired: true,
      type: 'text',
      name: 'fName',
      id: 'fName',
      formControlName: 'fName',
      validators: [Validators.required],
      errorMessage: 'Veuillez entrer votre prénom.',
    },
    {
      label: 'Nom',
      isRequired: true,
      type: 'text',
      name: 'lName',
      id: 'lName',
      formControlName: 'lName',
      validators: [Validators.required],
      errorMessage: 'Veuillez entrer votre nom de famille.',
    },
    {
      label: 'Société',
      isRequired: true,
      type: 'text',
      name: 'company',
      id: 'company',
      formControlName: 'company',
      validators: [Validators.required],
      errorMessage: 'Veuillez entrer le nom de votre entreprise.',
    },
    {
      label: 'Email',
      isRequired: true,
      type: 'email',
      name: 'email',
      id: 'email',
      formControlName: 'email',
      validators: [Validators.required, Validators.email],
      errorMessage: 'Veuillez entrer une adresse email valide.',
    },
    {
      label: 'Téléphone',
      isRequired: true,
      type: 'text',
      name: 'phone',
      id: 'phone',
      formControlName: 'phone',
      validators: [Validators.required],
      errorMessage: 'Veuillez entrer votre numéro de téléphone.',
    },
  ];
  isFormSuccess: WritableSignal<boolean> = signal(false);
  isFormSubmited: WritableSignal<boolean> = signal(false);

  onSubmit() {
    if (this.requestDemoFormGroup.valid) {
      console.log(this.requestDemoFormGroup.value);
      this.isFormSuccess.set(true);
      this.isFormSubmited.set(false);
    } else {
      this.isFormSuccess.set(false);
      this.isFormSubmited.set(true);
    }
  }
}
