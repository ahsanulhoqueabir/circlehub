import { createServerClient } from "@/lib/supabase";
import { LostItemsService } from "@/services/lost-items.services";
import { uploadDocumentFromBase64 } from "@/services/clodinary.services";
import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import {
  CreateLostItemRequest,
  ItemFilterOptions,
  ItemCategory,
  SortOption,
  ItemStatus,
} from "@/types/items.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/items/lost
 * Get lost items with advanced filtering and pagination
 * Query params:
 * - category: ItemCategory | "all"
 * - status: ItemStatus (default: "active")
 * - search: string
 * - tags: string[] (comma-separated)
 * - location: string
 * - dateFrom: string (ISO date)
 * - dateTo: string (ISO date)
 * - userId: string
 * - sort: SortOption (newest, oldest, most-viewed, recently-updated)
 * - limit: number (default: 20)
 * - offset: number (default: 0)
 * - action: "statistics" | "search" | "user-items" (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Check for special actions
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");

    // Handle statistics endpoint
    if (action === "statistics") {
      const stats = await LostItemsService.getStatistics(userId || undefined);
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Build filter options
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

    // Get items with filters
    const result = await LostItemsService.getItems(filters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get lost items error:", error);
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
 * POST /api/items/lost
 * Create a new lost item (requires authentication)
 */
export const POST = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    // Parse request body
    const body: CreateLostItemRequest = await req.json();

    // Validate required fields
    const { title, description, category, location, dateLost, contactInfo } =
      body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !dateLost ||
      !contactInfo
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
            "dateLost",
            "contactInfo",
          ],
        },
        { status: 400 }
      );
    }

    // Handle image upload if base64 image is provided
    let imageUrl: string | null = null;
    if (body.imageBase64) {
      try {
        // Upload to Cloudinary
        imageUrl = await uploadDocumentFromBase64(
          body.imageBase64,
          "lost-items", // folder name in Cloudinary
          `lost_${Date.now()}` // filename
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

    // Create item using service with user ID from JWT
    const item = await LostItemsService.createItem(user.id, {
      title,
      description,
      category,
      location,
      date_lost: dateLost,
      contact_info: contactInfo,
      image_url: imageUrl,
      tags: body.tags || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lost item reported successfully",
        data: item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lost item error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
});
