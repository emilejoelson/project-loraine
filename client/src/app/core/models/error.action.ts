import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorAction extends Action {
  error?: {
    error?: string | HttpErrorResponse | Error; // Allow string, HttpErrorResponse, or Error
    message?: string; // Optional message property for error objects
  };
}
