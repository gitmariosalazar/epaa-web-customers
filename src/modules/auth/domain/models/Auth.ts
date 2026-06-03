/** Minimal auth user — subset of the full profile returned on login */
export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  registeredAt: Date;
  lastLogin?: Date | null;
  twoFactorEnabled?: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginCredentials {
  username_or_email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
