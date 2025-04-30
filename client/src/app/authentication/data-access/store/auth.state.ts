import { User } from '../../signup/data-access/models/user';
import { UserProfileResponse } from '../models/auth.response';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSignupSuccess: boolean;
  profile: UserProfileResponse | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isSignupSuccess: false,
  profile:null,
};
