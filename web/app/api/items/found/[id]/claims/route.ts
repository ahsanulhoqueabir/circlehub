import { NextRequest, NextResponse } from "next/server";
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;
import { withAuth } from "@/middleware/with-auth";
import { FoundItemClaimsService } from "@/services/found-item-claims.services";
import { JwtPayload } from "@/types/jwt.types";

/**
 * GET /api/items/found/[id]/claims
 * Get all claims for a specific found item (requires authentication and ownership)
 */
export const GET = withAuth(
  async (
    request: NextRequest,
    user: JwtPayload,
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (!context?.params) {
        return corsResponse(
          {
            success: false,
            error: "Missing item ID",
          },
          { status: 400 }
        );
      }

      const { id: itemId } = await context.params;

      const result = await FoundItemClaimsService.getClaimsByItemId(
        itemId,
        user.userId
      );

      if (!result.success) {
        return corsResponse(
          {
            success: false,
            error: result.error,
          },
          { status: result.statusCode }
        );
      }

      return corsResponse({
        success: true,
        claims: result.data,
        total: result.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching item claims:", error);
      return corsResponse(
        {
          success: false,
          error: "Failed to fetch claims",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
);
