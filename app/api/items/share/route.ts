import { ShareItemsService } from "@/services/share-items.services";
import { uploadDocumentFromBase64 } from "@/services/clodinary.services";
import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import {
  CreateShareItemRequest,
  ItemFilterOptions,
  ItemCategory,
  SortOption,
  ItemStatus,
} from "@/types/items.types";
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

    if (action === "statistics") {
      const stats = await ShareItemsService.getStatistics(userId || undefined);
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    const filters: ItemFilterOptions & {
      offerType?: string;
      condition?: string;
    } = {
      category: (searchParams.get("category") as ItemCategory) || undefined,
      status: (searchParams.get("status") as ItemStatus) || "available",
      search: searchParams.get("search") || undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || undefined,
      location: searchParams.get("location") || undefined,
      userId: userId || undefined,
      sort: (searchParams.get("sort") as SortOption) || "newest",
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
      offerType: searchParams.get("offerType") || undefined,
      condition: searchParams.get("condition") || undefined,
    };

    const result = await ShareItemsService.getItems(filters);

    return NextResponse.json({
      success: true,
      data: result,
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
    const body: CreateShareItemRequest = await req.json();
    const { title, description, category, location, offerType, condition } =
      body;

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
    if (offerType === "sale" && (!body.price || body.price <= 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Price is required for sale items and must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Handle image upload if base64 image is provided
    let imageUrl: string | null = null;
    if (body.imageBase64) {
      try {
        imageUrl = await uploadDocumentFromBase64(
          body.imageBase64,
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

    const item = await ShareItemsService.createItem(user.id, {
      title,
      description,
      category,
      location,
      offer_type: offerType,
      condition,
      price: offerType === "sale" ? body.price : null,
      image_url: imageUrl,
      tags: body.tags || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Share item created successfully",
        data: item,
      },
      { status: 201 }
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
