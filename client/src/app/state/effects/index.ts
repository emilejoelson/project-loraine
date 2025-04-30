import { AuthEffects } from '../../authentication/data-access/store/effects/auth.effects';
import { ErrorEffects } from './error.effects';

export const AppEffects = [ErrorEffects,AuthEffects];
