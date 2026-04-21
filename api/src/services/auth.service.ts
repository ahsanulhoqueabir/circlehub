import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import { LoginInput, RegisterInput } from "../validations/auth.validation";
import { ApiError } from "../utils/api-error";
import {
  generateTokens,
  getRefreshTokenExpiryDate,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt.service";
import { AuthTokens, JwtPayload, UserProfile } from "../types/auth";
import {
  blacklistAccessToken,
  persistRefreshTokenSession,
  revokeAllRefreshTokenSessions,
  revokeRefreshTokenSession,
  rotateRefreshTokenSession,
  validateRefreshTokenSession,
} from "./token-security.service";

const SALT_ROUNDS = 10;

const toUserProfile = (user: {
  _id: unknown;
  name: string;
  email: string;
  studentId: string;
  department: string;
  batch: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "moderator" | "support_staff";
  isVerified: boolean;
  createdAt: Date;
}): UserProfile => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  studentId: user.studentId,
  department: user.department,
  batch: user.batch,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});

const buildPayload = (profile: UserProfile): JwtPayload => ({
  userId: profile._id,
  email: profile.email,
  role: profile.role,
});

export const registerUser = async (
  payload: RegisterInput,
): Promise<{ user: UserProfile; tokens: AuthTokens }> => {
  const existingUser = await User.findOne({
    email: payload.email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "A user with this email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const createdUser = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: hashedPassword,
    studentId: payload.studentId,
    department: payload.department,
    batch: payload.batch,
    phone: payload.phone,
  });

  const userProfile = toUserProfile(createdUser);
  const tokens = generateTokens(buildPayload(userProfile));
  await persistRefreshTokenSession(
    userProfile._id,
    tokens.refreshToken,
    getRefreshTokenExpiryDate(tokens.refreshToken),
  );

  return {
    user: userProfile,
    tokens,
  };
};

export const loginUser = async (
  payload: LoginInput,
): Promise<{ user: UserProfile; tokens: AuthTokens }> => {
  const user = await User.findOne({
    email: payload.email.toLowerCase(),
  }).select("+password");

  if (!user?.password) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Email or password is incorrect",
    );
  }

  const passwordMatched = await bcrypt.compare(payload.password, user.password);

  if (!passwordMatched) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Email or password is incorrect",
    );
  }

  const profile = toUserProfile(user);
  const tokens = generateTokens(buildPayload(profile));

  await persistRefreshTokenSession(
    profile._id,
    tokens.refreshToken,
    getRefreshTokenExpiryDate(tokens.refreshToken),
  );

  return {
    user: profile,
    tokens,
  };
};

export const refreshAuthToken = async (
  refreshToken: string,
): Promise<{ user: UserProfile; tokens: AuthTokens }> => {
  let payload: JwtPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const isStoredSessionValid = await validateRefreshTokenSession(
    payload.userId,
    refreshToken,
  );

  if (!isStoredSessionValid) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Refresh token has been revoked or already rotated",
    );
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "User does not exist for this token",
    );
  }

  const profile = toUserProfile(user);
  const tokens = generateTokens(buildPayload(profile));

  await rotateRefreshTokenSession(
    profile._id,
    refreshToken,
    tokens.refreshToken,
    getRefreshTokenExpiryDate(tokens.refreshToken),
  );

  return {
    user: profile,
    tokens,
  };
};

export const getCurrentUserById = async (
  userId: string,
): Promise<UserProfile> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return toUserProfile(user);
};

export const logoutUser = async (
  accessToken?: string,
  refreshToken?: string,
): Promise<void> => {
  if (accessToken) {
    try {
      const accessPayload = verifyAccessToken(accessToken);
      await blacklistAccessToken(accessPayload, "logout");
    } catch {
      // Ignore invalid access token on logout and continue refresh session revocation.
    }
  }

  if (refreshToken) {
    try {
      const refreshPayload = verifyRefreshToken(refreshToken);
      await revokeRefreshTokenSession(refreshPayload.userId, refreshToken);
    } catch {
      // Ignore invalid refresh token on logout to keep endpoint idempotent.
    }
  }
};

export const logoutUserFromAllDevices = async (
  userId: string,
  accessToken?: string,
): Promise<void> => {
  await revokeAllRefreshTokenSessions(userId);

  if (accessToken) {
    try {
      const accessPayload = verifyAccessToken(accessToken);
      await blacklistAccessToken(accessPayload, "logout-all");
    } catch {
      // Ignore invalid access token on logout-all to keep endpoint idempotent.
    }
  }
};
