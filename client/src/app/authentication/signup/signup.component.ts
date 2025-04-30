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
import { Observable, Subject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import {
  selectError,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsSignupSuccess,
  selectUserRole,
  selectUserRoles,
} from '../data-access/store/selectors/auth.selectors';
import { AuthActions } from '../data-access/store/actions/auth.actions';
import { State } from '../../state/root.state';
import { CustomInputComponent } from '../../shared/ui/custom-input/custom-input.component';
import { CustomSelectComponent } from '../../shared/ui/custom-select/custom-select.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomInputComponent,
    CustomSelectComponent,
    TranslateModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  profilePreview: string | null = null;
  profileImageFile: File | null = null;
  cvFile: File | null = null;
  passwordVisibility: { [key: string]: boolean } = {
    password: false,
    confirmPassword: false,
  };

  isLoading$!: Observable<boolean>;
  isSignupSuccess$!: Observable<boolean>;
  error$!: Observable<string | null>;
  isAuthenticated$!: Observable<boolean>;
  userRole$!: Observable<string | null>;
  userRoles$!: Observable<any[] | null>;
  isAdmin$!: Observable<boolean>;
  isSubmitting = false;
  isSuccess = false;
  
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  commonInputClass =
    'peer w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:outline-none focus:border-purple-500 appearance-none';
  commonLabelClass = 'left-3 -top-2.5 text-sm text-gray-600 bg-white px-1';

  formFields = {
    personalInfo: [
      {
        id: 'civility',
        type: 'select',
        title: 'Civilité',
        classControl: this.commonInputClass,
        classLabel: this.commonLabelClass,
        options: [
          { value: 'Monsieur', label: 'Mr' },
          { value: 'Madame', label: 'Mme' },
          {
            value: 'Mademoiselle',
            label: 'Mle',
          },
        ],
      },
      {
        id: 'phone',
        type: 'tel',
        title: 'Phone',
        classControl: this.commonInputClass,
        classLabel: this.commonLabelClass,
        placeholder: '+33612345678',
      },
      {
        id: 'lastName',
        type: 'text',
        title: 'Prénom',
        classControl: this.commonInputClass,
        classLabel: this.commonLabelClass,
      },
      {
        id: 'firstName',
        type: 'text',
        title: 'Nom',
        classControl: this.commonInputClass,
        classLabel: this.commonLabelClass,
      },
    ],
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
        placeholder: 'Créez un mot de passe sécurisé',
      },
      {
        id: 'confirmPassword',
        type: 'password',
        title: 'Confirmer le mot de passe',
        classControl: this.commonInputClass,
        classLabel: this.commonLabelClass,
        placeholder: 'Confirmez votre mot de passe',
      },
    ],
    terms: [
      {
        id: 'termsAccepted',
        type: 'checkbox',
        label: "J'accepte les",
        hasLink: true,
        linkText: "Conditions générales d'utilisation",
        description:
          "En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.",
      },
      {
        id: 'jobOffersAccepted',
        type: 'checkbox',
        label:
          "Je souhaite recevoir les offres d'emploi correspondant à mon profil",
        description:
          'Nous vous enverrons uniquement les offres pertinentes selon vos critères.',
      },
      {
        id: 'newsletterAccepted',
        type: 'checkbox',
        label: 'Je souhaite recevoir la newsletter et les actualités',
        description:
          'Restez informé des tendances du marché et des conseils carrière.',
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
    this.setupDragAndDrop();
    
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.error$ = this.store.pipe(select(selectError));
    this.isSignupSuccess$ = this.store.pipe(select(selectIsSignupSuccess));
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.userRole$ = this.store.pipe(select(selectUserRole));
    this.userRoles$ = this.store.pipe(select(selectUserRoles));
    this.isAdmin$ = this.store.pipe(select(selectIsAdmin));
    
    this.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.isSubmitting = loading;
    });
    
    this.isSignupSuccess$
      .pipe(
        filter((isSuccess) => isSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isSuccess = true;
        // Reset the form when signup is successful
        this.resetForm();
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      });

    this.store.dispatch(AuthActions.resetSignupState());
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  onLogin() {
    this.router.navigate(['/features/connexion']);
    window.scrollTo(0, 0);
  }
  
  initForm(): void {
    const formConfig: { [key: string]: any } = {};

    this.formFields.personalInfo.forEach((field) => {
      const validators = [];

      if (field.id === 'civility') {
        validators.push(Validators.required);
        formConfig[field.id] = ['Monsieur', validators];
      } else if (field.id === 'phone') {
        validators.push(
          Validators.required,
          Validators.pattern('^[+][0-9]{10,15}$')
        );
        formConfig[field.id] = ['', validators];
      } else if (field.id === 'lastName' || field.id === 'firstName') {
        validators.push(Validators.required);
        formConfig[field.id] = ['', validators];
      }
    });

    this.formFields.accountInfo.forEach((field) => {
      const validators = [];

      if (field.id === 'email') {
        validators.push(Validators.required, Validators.email);
      } else if (field.id === 'password') {
        validators.push(Validators.required, Validators.minLength(8));
      } else if (field.id === 'confirmPassword') {
        validators.push(Validators.required);
      }

      formConfig[field.id] = ['', validators];
    });

    this.formFields.terms.forEach((checkbox) => {
      const validators = [];

      if (checkbox.id === 'termsAccepted') {
        validators.push(Validators.requiredTrue);
        formConfig[checkbox.id] = [false, validators];
      } else if (checkbox.id === 'jobOffersAccepted') {
        formConfig[checkbox.id] = [true];
      } else if (checkbox.id === 'newsletterAccepted') {
        formConfig[checkbox.id] = [false];
      }
    });

    this.signupForm = this.fb.group(formConfig, {
      validators: this.passwordMatchValidator,
    });
  }

  // Method to reset the form and related state
  resetForm(): void {
    // Reset form to initial values
    this.signupForm.reset({
      civility: 'Monsieur',
      phone: '',
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      jobOffersAccepted: true,
      newsletterAccepted: false
    });
    
    // Reset file-related state
    this.profilePreview = null;
    this.profileImageFile = null;
    this.cvFile = null;
    
    // Reset form validation state
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

  setupDragAndDrop(): void {
    const uploadZone = document.querySelector('.upload-zone');

    if (uploadZone) {
      uploadZone.addEventListener('dragover', (e: Event) => {
        e.preventDefault();
        (uploadZone as HTMLElement).classList.add('ring-4', 'ring-indigo-300');
      });

      uploadZone.addEventListener('dragleave', (e: Event) => {
        e.preventDefault();
        (uploadZone as HTMLElement).classList.remove(
          'ring-4',
          'ring-indigo-300'
        );
      });

      uploadZone.addEventListener('drop', (e: any) => {
        e.preventDefault();
        (uploadZone as HTMLElement).classList.remove(
          'ring-4',
          'ring-indigo-300'
        );

        const file = e.dataTransfer.files[0];
        if (file) {
          this.handleFile(file);
        }
      });
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File): void {
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5 MB');
      return;
    }

    this.profileImageFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  togglePasswordVisibility(fieldId: string): void {
    this.passwordVisibility[fieldId] = !this.passwordVisibility[fieldId];
  }

  getPasswordStrength(): string {
    const password = this.signupForm.get('password')?.value;
    if (!password) return 'Faible';

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = [
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (strength <= 2) return 'Faible';
    if (strength <= 4) return 'Moyen';
    return 'Fort';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();

    switch (strength) {
      case 'Faible':
        return 'w-1/4 bg-red-500';
      case 'Moyen':
        return 'w-2/4 bg-yellow-500';
      case 'Fort':
        return 'w-3/4 bg-green-500';
      default:
        return 'w-0';
    }
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();

    switch (strength) {
      case 'Faible':
        return 'text-red-600';
      case 'Moyen':
        return 'text-yellow-600';
      case 'Fort':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;
      
      this.store.dispatch(AuthActions.signup({
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        profileImage: this.profilePreview,
        cvFile: null,
        personalInfo: {
          civility: formValue.civility,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          telephone: formValue.phone
        },
        professionalInfo: {
          currentPosition: '',
          desiredPosition: '',
          enterprise: '',
          hasRemoteExperience: false,
          experiences: []
        },
        academicInfo: {
          formation: {
            level: '',
            languages: []
          },
          motivation: ''
        }
      }));
    } else {
      Object.keys(this.signupForm.controls).forEach((key) => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}