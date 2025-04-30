import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [ReactiveFormsModule, RecaptchaV3Module],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="submitHandler()">
      <div class="flex items-center gap-x-10 gap-y-6 flex-wrap lg:flex-nowrap">
        <div class="w-full lg:w-fit">
          <h3 class="font-semibold text-[22px] text-white">
            Cette plateforme vous intéresse ?
          </h3>
          <p class="text-[14px] mt-4 text-white">
            Abonnez- vous à notre Newsletter pourrester à l’afflux des
            nouveautés
          </p>
        </div>
        <div>
          <input
            type="email"
            placeholder="votre Email"
            class="{{
              isValidToShowError() ? 'border-[rgb(235,57,66)]' : 'border-white'
            }} border border-solid w-full bg-transparent outline-none  px-4 py-3 rounded-xl text-white placeholder:font-medium placeholder:capitalize placeholder:text-white placeholder:text-[14px] sm:w-[330px]"
            formControlName="email"
            id="email"
            name="email"
            (focus)="isEmailInputOnFocus = true; isFormSuccess = false"
            (blur)="isEmailInputOnFocus = false"
          />
          @if (isValidToShowError()) {
            <p
              class="text-[0.8125rem] leading-[1.53846] font-normal text-[rgb(235,57,66)]"
            >
              Veuillez saisir une adresse e-mail valide
            </p>
          }
        </div>
        <button
          class="tracking-[1.25px] px-4 py-2 rounded-[10px] font-medium bg-white text-sm text-[rgba(60,70,76,1)] xl:text-lg"
        >
          Je m’abonne maintenant
        </button>
      </div>
      @if (isFormSuccess) {
        <div class="text-green-400 pt-3 relative" role="alert">
          <strong class="font-bold">Inscription réussie !</strong>
          <span class="block sm:inline"
            >Merci pour votre intérêt. Vous êtes désormais inscrit à notre
            newsletter.</span
          >
        </div>
      }
    </form>
  `,
})
export class NewsletterFormComponent implements OnDestroy {
  recaptchaV3Service = inject(ReCaptchaV3Service);
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isFormSuccess = false;
  isFormSubmited = false;
  isEmailInputOnFocus = false;

  private recaptchaV3Subscription?: Subscription;

  submitHandler() {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value.email);

      this.formGroup.reset();

      this.isFormSuccess = true;
      this.isFormSubmited = false;

      this.recaptchaV3Subscription = this.recaptchaV3Service
        .execute('newsletterSubscribe')
        .subscribe((token) => {
          console.log(`Token [${token}] generated`);
        });
    } else {
      this.isFormSubmited = true;
      this.isFormSuccess = false;
    }
  }

  isValidToShowError() {
    return (
      !this.formGroup.controls.email.valid &&
      !this.isEmailInputOnFocus &&
      this.isFormSubmited
    );
  }

  ngOnDestroy(): void {
    if (this.recaptchaV3Subscription) {
      this.recaptchaV3Subscription.unsubscribe();
    }
  }
}
