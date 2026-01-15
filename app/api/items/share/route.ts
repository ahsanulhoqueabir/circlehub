import { ShareItemsService } from "@/services/share-items.services";
import { uploadDocumentFromBase64 } from "@/services/clodinary.services";
import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/items/share
 * Get share items with advanced filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const action = searchParams.get("action");
    const userId = searchParams.get("userId");

    // Handle statistics request
    if (action === "statistics") {
      const result = await ShareItemsService.getStatistics(userId || undefined);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: result.statusCode }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }

    // Handle regular list request
    const filters = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      category: searchParams.get("category") || undefined,
      status:
        (searchParams.get("status") as "available" | "reserved" | "shared") ||
        "available",
      location: searchParams.get("location") || undefined,
      userId: userId || undefined,
      sortBy: (searchParams.get("sortBy") as "date" | "price") || "date",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      offerType:
        (searchParams.get("offerType") as "free" | "sale") || undefined,
      condition:
        (searchParams.get("condition") as
          | "new"
          | "like-new"
          | "good"
          | "fair") || undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || undefined,
    };

    const result = await ShareItemsService.getItems(filters);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Get share items error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/items/share
 * Create a new share item (requires authentication)
 */
export const POST = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const body = await req.json();
    const {
      title,
      description,
      category,
      location,
      offerType,
      condition,
      price,
      tags,
      imageBase64,
    } = body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !offerType ||
      !condition
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: [
            "title",
            "description",
            "category",
            "location",
            "offerType",
            "condition",
          ],
        },
        { status: 400 }
      );
    }

    // Validate price for sale items
    if (offerType === "sale" && (!price || price <= 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Price is required for sale items and must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Handle image upload if base64 image is provided
    let imageUrl: string | undefined = undefined;
    if (imageBase64) {
      try {
        imageUrl = await uploadDocumentFromBase64(
          imageBase64,
          "share-items",
          `share_${Date.now()}`
        );
      } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to upload image. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    const result = await ShareItemsService.createItem({
      userId: user.userId,
      itemData: {
        title,
        description,
        category,
        location,
        offerType,
        condition,
        price: offerType === "sale" ? price : undefined,
        imageUrl,
        tags: tags || [],
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: result.statusCode }
    );
  } catch (error) {
    console.error("Create share item error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
});
