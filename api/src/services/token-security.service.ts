import crypto from "crypto";
import mongoose from "mongoose";
import AccessTokenBlacklist from "../models/access-token-blacklist.model";
import RefreshTokenSession from "../models/refresh-token-session.model";
import { VerifiedJwtPayload } from "../types/auth";

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const persistRefreshTokenSession = async (
  userId: string,
  refreshToken: string,
  expiresAt: Date,
): Promise<void> => {
  await RefreshTokenSession.create({
    userId: new mongoose.Types.ObjectId(userId),
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });
};

export const validateRefreshTokenSession = async (
  userId: string,
  refreshToken: string,
): Promise<boolean> => {
  const tokenHash = hashToken(refreshToken);
  const session = await RefreshTokenSession.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    tokenHash,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  return Boolean(session);
};

export const rotateRefreshTokenSession = async (
  userId: string,
  oldRefreshToken: string,
  newRefreshToken: string,
  newExpiresAt: Date,
): Promise<void> => {
  const oldTokenHash = hashToken(oldRefreshToken);

  await RefreshTokenSession.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(userId),
      tokenHash: oldTokenHash,
      revokedAt: { $exists: false },
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );

  await persistRefreshTokenSession(userId, newRefreshToken, newExpiresAt);
};

export const revokeRefreshTokenSession = async (
  userId: string,
  refreshToken: string,
): Promise<void> => {
  const tokenHash = hashToken(refreshToken);

  await RefreshTokenSession.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(userId),
      tokenHash,
      revokedAt: { $exists: false },
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};

export const revokeAllRefreshTokenSessions = async (
  userId: string,
): Promise<void> => {
  await RefreshTokenSession.updateMany(
    {
      userId: new mongoose.Types.ObjectId(userId),
      revokedAt: { $exists: false },
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};

export const blacklistAccessToken = async (
  payload: VerifiedJwtPayload,
  reason = "logout",
): Promise<void> => {
  const expiresAt = new Date(payload.exp * 1000);

  if (expiresAt <= new Date()) {
    return;
  }

  await AccessTokenBlacklist.updateOne(
    { jti: payload.jti },
    {
      $setOnInsert: {
        userId: new mongoose.Types.ObjectId(payload.userId),
        reason,
        expiresAt,
      },
    },
    { upsert: true },
  );
};

export const isAccessTokenBlacklisted = async (
  jti: string,
): Promise<boolean> => {
  const blacklisted = await AccessTokenBlacklist.findOne({
    jti,
    expiresAt: { $gt: new Date() },
  }).select("_id");

  return Boolean(blacklisted);
};
