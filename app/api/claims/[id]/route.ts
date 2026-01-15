import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/with-auth";
import { FoundItemClaimsService } from "@/services/found-item-claims.services";
import { JwtPayload } from "@/types/jwt.types";

/**
 * GET /api/claims/[id]
 * Get specific claim details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: JwtPayload) => {
    try {
      const { id } = await params;

      // This would need to be implemented in the service if needed
      return NextResponse.json(
        { error: "Not implemented yet", claimId: id },
        { status: 501 }
      );
    } catch (error) {
      console.error("Error fetching claim:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch claim",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  })(request);
}

/**
 * PATCH /api/claims/[id]
 * Update claim status (approve/reject)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: JwtPayload) => {
    try {
      const { id: claimId } = await params;
      const body = await req.json();

      if (!body.status || !["approved", "rejected"].includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid status. Must be 'approved' or 'rejected'",
          },
          { status: 400 }
        );
      }

      const result = await FoundItemClaimsService.updateClaimStatus(
        claimId,
        user.userId,
        body.status
      );

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: result.statusCode }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.data?.message || "Claim updated successfully",
        claim: result.data?.claim,
      });
    } catch (error) {
      console.error("Error updating claim:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update claim",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  })(request);
}

/**
 * DELETE /api/claims/[id]
 * Delete a claim
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: JwtPayload) => {
    try {
      const { id: claimId } = await params;

      const result = await FoundItemClaimsService.deleteClaim(
        claimId,
        user.userId
      );

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: result.statusCode }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.data?.message || "Claim deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting claim:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete claim",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  })(request);
}
