import { ActionReducer, MetaReducer } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorAction } from '../../core/models/error.action';
import { State } from '../root.state';

export function log(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action: ErrorAction) => {
    const currentState = reducer(state, action);

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
    console.groupCollapsed(action.type);
    console.log('Previous state:', state);

    if (errorMessage) {
      console.log('Error:', errorMessage);
    } else {
      console.log('Action:', action);
    }

    console.log('Next state:', currentState);
    console.groupEnd();
    
    return currentState;
  };
}

export const metaReducers: MetaReducer<State>[] = [log];
