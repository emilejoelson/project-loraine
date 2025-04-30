import { inject, Injectable } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { tap } from 'rxjs';
import { ErrorAction } from '../../core/models/error.action';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorTranslationService } from '../../core/services/error-translation.service';
import { AuthActions } from '../../authentication/data-access/store/actions/auth.actions';

@Injectable()
export class ErrorEffects {
  private toastService = inject(ToastService);
  private actions$ = inject(Actions);
  errorTransactionService = inject(ErrorTranslationService);

  handleErrors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.signupFailure,  // Added auth error actions
          AuthActions.loginFailure,   // Added auth error actions
          AuthActions.uploadProfileImageFailure // Added profile image upload error action
        ),
        tap((action: ErrorAction) => {
          const error = action.error?.error;
          let errorMessage: string | undefined;

          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error instanceof HttpErrorResponse) {
            errorMessage = error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          } else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = (error as { message?: string }).message;
          }

          if (errorMessage) {
            this.toastService.createToast(
              'error',
              this.errorTransactionService.translateError(errorMessage)
            );
          }
        })
      ),
    { dispatch: false }
  );
}
