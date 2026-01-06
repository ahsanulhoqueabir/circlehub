import { jwtSecret } from "@/config/env";
import * as jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { JwtVerifyResult } from "@/types/jwt.types";

export class JWTService {
  /**
   * Generate JWT token for authenticated user
   */
  static generateJWTToken(payload: {
    id: string;
    email: string;
    role: string;
  }): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      jwtSecret.secret,
      { expiresIn: jwtSecret.expire } as jwt.SignOptions
    );
  }

  /**
   * Verify JWT token (only decode and validate, no DB fetch)
   */
  static verifyToken(token: string): JwtVerifyResult {
    try {
      const decoded = jwt.verify(token, jwtSecret.secret) as JwtPayload;
      if (
        !decoded ||
        typeof decoded.id !== "string" ||
        typeof decoded.email !== "string" ||
        typeof decoded.role !== "string"
      ) {
        return {
          valid: false,
          error: "Invalid token payload",
        };
      }

      return {
        valid: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid token",
      };
    }
  }

  /**
   * Decode any JWT token without verifying its signature.
   * Returns the decoded payload or `null` if decoding fails or token is invalid.
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token);
      return (decoded as JwtPayload) ?? null;
    } catch {
      return null;
    }
  }
}
