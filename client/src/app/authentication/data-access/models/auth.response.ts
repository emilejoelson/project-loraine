export interface AuthResponse {
  message: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  role?: string;
  roles?: Role[];
}

export interface Role {
  id: string;
  name: string;
}

export interface UserProfileResponse {
  email: string;
  profileImage: string;
  firstName: string;
  lastName: string;
}
