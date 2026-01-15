import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/with-auth";
import { ClaimsService } from "@/services/claims.services";

// GET /api/claims/[id] - Get specific claim details
async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      const { id } = await params;

      // This would need to be implemented in the service
      // For now, we'll just return an error
      return NextResponse.json(
        { error: "Not implemented yet", claimId: id },
        { status: 501 }
      );
    } catch (error) {
      console.error("Error fetching claim:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch claim",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  })(request);
}

// PATCH /api/claims/[id] - Update claim status (approve/reject)
async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req, user) => {
    try {
      const { id: claimId } = await params;
      const body = await req.json();

      const updatedClaim = await ClaimsService.updateClaimStatus(
        claimId,
        user.id,
        body
      );

      return NextResponse.json({
        claim: updatedClaim,
        message: "Claim updated successfully",
      });
    } catch (error) {
      console.error("Error updating claim:", error);
      return NextResponse.json(
        {
          error: "Failed to update claim",
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
  })(request);
}

// DELETE /api/claims/[id] - Delete a claim
async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req, user) => {
    try {
      const { id: claimId } = await params;

      await ClaimsService.deleteClaim(claimId, user.id);

      return NextResponse.json({
        message: "Claim deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting claim:", error);
      return NextResponse.json(
        {
          error: "Failed to delete claim",
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
  })(request);
}

export { GET, PATCH, DELETE };
