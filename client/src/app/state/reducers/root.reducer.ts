// root.reducer.ts
import { ActionReducerMap } from '@ngrx/store';
import { State } from '../root.state';
import { authReducer } from '../../authentication/data-access/store/reducers/auth.reducer';

export const rootReducer: ActionReducerMap<State> = {
  authentication: authReducer,
};
