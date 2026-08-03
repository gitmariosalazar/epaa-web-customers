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
  isNaturalPerson?: boolean;
  cardId?: string;
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
/** Payload sent to POST /auth/verify */
export interface VerifyUserRequest {
  username_or_email: string;
}
/**
 * Result from the backend verify endpoint.
 * `exists` — user record found in DB.
 * `isActive` — account is enabled and allowed to operate.
 */
export interface VerifyUserResult {
  exists: boolean;
  userId?: string;
  username?: string;
  email?: string;
  isActive?: boolean;
}
