import { FoundItemsService } from "@/services/found-items.services";
import { uploadDocumentFromBase64 } from "@/services/cloudinary.services";
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
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;

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
      const stats_result = await FoundItemsService.getStatistics(
        userId || undefined,
      );

      if (!stats_result.success) {
        return corsResponse(
          {
            success: false,
            error: stats_result.error,
          },
          { status: stats_result.statusCode }
        );
      }

      return corsResponse({
        success: true,
        data: stats_result.data,
      });
    }

    // ... (rest of filtering)
    const result = await FoundItemsService.getItems(filters);

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
      data: result.data,
    });
  } catch (error) {
    console.error("Get found items error:", error);
    return corsResponse(
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
      return corsResponse(
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
          `found_${Date.now()}`,
        );
      } catch (error) {
        console.error("Image upload error:", error);
        return corsResponse(
          {
            success: false,
            error: "Failed to upload image. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    const result = await FoundItemsService.createItem(user.userId, {
      title,
      description,
      category,
      location,
      dateFound,
      imageUrl,
      tags: body.tags || [],
    });

    if (!result.success) {
      return corsResponse(
        {
          success: false,
          error: result.error,
        },
        { status: result.statusCode }
      );
    }

    return corsResponse(
      {
        success: true,
        message: result.data?.message || "Found item reported successfully",
        data: result.data?.item,
      },
      { status: result.statusCode }
    );
  } catch (error) {
    console.error("Create found item error:", error);
    return corsResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
});
