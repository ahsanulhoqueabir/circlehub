// Auth Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  university?: string;
  studentId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  university?: string;
  studentId?: string;
  verified: boolean;
  role: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: UserProfile;
  token?: string;
}

export interface GoogleAuthResponse {
  url: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthErrorResponse {
  error: string;
}

// Service Response Types (for internal use)
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
