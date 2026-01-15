import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/with-auth";
import { ClaimsService } from "@/services/claims.services";

// GET /api/claims - Get user's claims (made by user and received by user)
async function GET(request: NextRequest) {
  return withAuth(async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get("type") || "made"; // 'made' or 'received'

      let claims;
      if (type === "received") {
        // Get claims on items user found
        claims = await ClaimsService.getReceivedClaims(user.id);
      } else {
        // Get claims user made
        claims = await ClaimsService.getClaimsByUserId(user.id);
      }

      return NextResponse.json({
        claims,
        total: claims.length,
      });
    } catch (error) {
      console.error("Error fetching claims:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch claims",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  })(request);
}

// POST /api/claims - Create a new claim
async function POST(request: NextRequest) {
  return withAuth(async (req, user) => {
    try {
      const body = await req.json();

      if (!body.found_item_id) {
        return NextResponse.json(
          { error: "found_item_id is required" },
          { status: 400 }
        );
      }

      const claim = await ClaimsService.createClaim(user.id, body);

      return NextResponse.json(
        { claim, message: "Claim submitted successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating claim:", error);

      // Extract error message from various error types
      let errorMessage = "Unknown error";
      let statusCode = 500;

      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("already claimed")) {
          statusCode = 400;
        } else if (error.message.includes("not found")) {
          statusCode = 404;
        } else if (error.message.includes("no longer available")) {
          statusCode = 400;
        } else if (error.message.includes("cannot claim your own")) {
          statusCode = 400;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String((error as any).message);
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      return NextResponse.json(
        {
          error: "Failed to create claim",
          details: errorMessage,
        },
        { status: statusCode }
      );
    }
  })(request);
}

export { GET, POST };
