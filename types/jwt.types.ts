import { UserProfile } from "./auth.types";

export interface JwtTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtVerifyResult {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface JwtValidateResult {
  valid: boolean;
  user?: UserProfile;
  error?: string;
}

export interface JwtRefreshResult {
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}
