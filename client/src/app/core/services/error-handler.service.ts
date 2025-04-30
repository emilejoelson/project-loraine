import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { TBaseResponse } from '../../shared/utils/definitions/response';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse) => {
      const errorMessage = this.getErrorMessage(error.status);

      console.error(`${operation} failed:`, error);

      return of({
        error:
          error.error &&
          typeof error.error?.message === 'string' &&
          error.error?.message?.length
            ? error.error?.message
            : errorMessage,
        result: result as T,
      } as TBaseResponse<T>);
    };
  }

  private getErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 404:
        return 'REQUEST_NOT_FOUND_ERROR_404';
      case 500:
        return 'UNEXPECTED_ERROR_500';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

}
