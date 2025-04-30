// state.config.ts
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { rootReducer } from './reducers/root.reducer';
import { AppEffects } from './effects';
import { metaReducers } from './reducers/meta.reducer';


export const storeConfig = {
  provideStore: provideStore(rootReducer, {
    metaReducers,
    runtimeChecks: {
      strictActionTypeUniqueness: false,
      strictActionImmutability: true,
      strictStateImmutability: true,
    },
  }),
  provideEffects: provideEffects(AppEffects),
};
