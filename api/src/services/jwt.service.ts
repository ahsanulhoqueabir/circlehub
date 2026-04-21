import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../config/env";
import { AuthTokens, JwtPayload, VerifiedJwtPayload } from "../types/auth";

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.JWT_ACCESS_EXPIRES_IN_MINUTES}m`,
    jwtid: randomUUID(),
  });
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.JWT_REFRESH_EXPIRES_IN_DAYS}d`,
    jwtid: randomUUID(),
  });
};

export const verifyAccessToken = (token: string): VerifiedJwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as VerifiedJwtPayload;
};

export const verifyRefreshToken = (token: string): VerifiedJwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as VerifiedJwtPayload;
};

export const getRefreshTokenExpiryDate = (token: string): Date => {
  const payload = verifyRefreshToken(token);
  return new Date(payload.exp * 1000);
};

export const generateTokens = (payload: JwtPayload): AuthTokens => {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};
