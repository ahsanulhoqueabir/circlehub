export type UserRole = "user" | "admin" | "moderator" | "support_staff";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface VerifiedJwtPayload extends JwtPayload {
  jti: string;
  iat: number;
  exp: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  batch: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
