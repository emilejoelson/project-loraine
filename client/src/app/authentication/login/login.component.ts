import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { State } from '../../state/root.state';
import { Store } from '@ngrx/store';
import { selectError, selectIsAuthenticated, selectIsLoading } from '../data-access/store/selectors/auth.selectors';
import { LoginRequest } from './data-access/models/login';
import { AuthActions } from '../data-access/store/actions/auth.actions';
import { CustomInputComponent } from '../../shared/ui/custom-input/custom-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomInputComponent,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  passwordVisibility = false;
  loginError: string | null = null;
  commonInputClass =
    'peer w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:outline-none focus:border-purple-500 appearance-none';
  commonLabelClass = 'left-3 -top-2.5 text-sm text-gray-600 bg-white px-1';
  
  private subscriptions: Subscription = new Subscription();

  formFields = {
    accountInfo: [
      {
        id: 'email',
        type: 'email',
        title: 'Adresse email',
        classControl: this.commonInputClass,
        classLabel: this.commonLabelClass,
        placeholder: 'votre.email@exemple.com',
      },
      {
        id: 'password',
        type: 'password',
        title: 'Mot de passe',
        classControl: this.commonInputClass,
        classLabel: this.commonLabelClass,
        placeholder: 'Entrez votre mot de passe',
      },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<State>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectIsLoading).subscribe(isLoading => {
        this.isSubmitting = isLoading;
      })
    );

    this.subscriptions.add(
      this.store.select(selectIsAuthenticated).subscribe(isAuthenticated => {
        this.isSuccess = isAuthenticated;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSignup() {
    this.router.navigate(['/features/inscription']);
    window.scrollTo(0, 0);
  }

  initForm(): void {
    const formConfig: { [key: string]: any } = {};

    this.formFields.accountInfo.forEach((field) => {
      const validators = [Validators.required];

      if (field.id === 'email') {
        validators.push(Validators.email);
      }

      formConfig[field.id] = ['', validators];
    });

    this.loginForm = this.fb.group(formConfig);
  }

  togglePasswordVisibility(): void {
    this.passwordVisibility = !this.passwordVisibility;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      
      this.store.dispatch(AuthActions.login(loginRequest));
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  forgotPassword(): void {
    this.router.navigate(['/reset-password']);
  }
}
