import { createServerClient } from "@/lib/supabase";
import { FoundItemsService } from "@/services/found-items.services";
import { uploadDocumentFromBase64 } from "@/services/clodinary.services";
import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import {
  CreateFoundItemRequest,
  ItemFilterOptions,
  ItemCategory,
  SortOption,
  ItemStatus,
} from "@/types/items.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/items/found
 * Get found items with advanced filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const action = searchParams.get("action");
    const userId = searchParams.get("userId");

    if (action === "statistics") {
      const stats = await FoundItemsService.getStatistics(userId || undefined);
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    const filters: ItemFilterOptions = {
      category: (searchParams.get("category") as ItemCategory) || undefined,
      status: (searchParams.get("status") as ItemStatus) || "active",
      search: searchParams.get("search") || undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || undefined,
      location: searchParams.get("location") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      userId: userId || undefined,
      sort: (searchParams.get("sort") as SortOption) || "newest",
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    };

    const result = await FoundItemsService.getItems(filters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get found items error:", error);
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
 * POST /api/items/found
 * Create a new found item (requires authentication)
 */
export const POST = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const body: CreateFoundItemRequest = await req.json();
    const { title, description, category, location, dateFound } = body;

    if (!title || !description || !category || !location || !dateFound) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: [
            "title",
            "description",
            "category",
            "location",
            "dateFound",
          ],
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
          "found-items",
          `found_${Date.now()}`
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

    const item = await FoundItemsService.createItem(user.id, {
      title,
      description,
      category,
      location,
      date_found: dateFound,
      image_url: imageUrl,
      tags: body.tags || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Found item reported successfully",
        data: item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create found item error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
});
