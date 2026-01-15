import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "@/lib/jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Extract JWT token from Authorization header
 */
export const getTokenFromHeader = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // Remove "Bearer " prefix
};

/**
 * Middleware to verify JWT token and extract user info
 * Returns user data if authenticated, otherwise returns error response
 */
export const authenticate = (
  request: NextRequest
):
  | { authenticated: true; user: JWTPayload }
  | { authenticated: false; response: NextResponse } => {
  const token = getTokenFromHeader(request);

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required. Please provide a valid token.",
        },
        { status: 401 }
      ),
    };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token. Please login again.",
        },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    user: decoded,
  };
};

/**
 * Helper function to get user ID from request
 * Use this in API routes after calling authenticate()
 */
export const getUserId = (request: NextRequest): string | null => {
  const auth = authenticate(request);
  return auth.authenticated ? auth.user.userId : null;
};
