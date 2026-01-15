import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/with-auth";
import { ClaimsService } from "@/services/claims.services";

// GET /api/items/found/[id]/claims - Get all claims for a specific found item
async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
    try {
      const itemId = params.id;

      const claims = await ClaimsService.getClaimsByItemId(itemId, user.id);

      return NextResponse.json({
        claims,
        total: claims.length,
      });
    } catch (error) {
      console.error("Error fetching item claims:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch claims",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        {
          status:
            error instanceof Error && error.message.includes("Unauthorized")
              ? 403
              : 500,
        }
      );
    }
  });
}

export { GET };
