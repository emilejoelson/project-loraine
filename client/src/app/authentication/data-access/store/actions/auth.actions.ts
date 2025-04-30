import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { AuthResponse, UserProfileResponse } from '../../models/auth.response';
import { SignupRequest } from '../../../signup/data-access/models/signup';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest } from '../../../login/data-access/models/login';
import { User } from '../../../signup/data-access/models/user';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Signup actions
    Signup: props<SignupRequest>(),
    'Signup Success': props<{ response: AuthResponse }>(),
    'Signup Failure': props<{
      error: { error: HttpErrorResponse | Error | string };
    }>(),
    'Reset Signup State': emptyProps(),

    // Login actions
    Login: props<LoginRequest>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{
      error: { error: HttpErrorResponse | Error | string };
    }>(),

    // Logout action
    Logout: emptyProps(),

    // Profile image upload
    'Upload Profile Image': props<{ file: File }>(),
    'Upload Profile Image Success': props<{ filePath: string }>(),
    'Upload Profile Image Failure': props<{
      error: { error: HttpErrorResponse | Error | string };
    }>(),

    // New actions to handle user profile updates
    'Load User Profile': emptyProps(),
    'Load User Profile Success': props<{ profile: UserProfileResponse }>(),
    'Load User Profile Failure': props<{
      error: { error: HttpErrorResponse | Error | string };
    }>(),

    'Clear User Profile': emptyProps(),

    'Initialize Auth': emptyProps(),
    'Initialize Auth Success': props<{
      user: User;
      profile: UserProfileResponse | null;
    }>(),
    'Initialize Auth Failure': props<{ error: any }>(),
  },
});
