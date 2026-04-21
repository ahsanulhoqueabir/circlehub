import { NextRequest, NextResponse } from "next/server";
import { ShareItemsService } from "@/services/share-items.services";
import { uploadDocumentFromBase64 } from "@/services/clodinary.services";
import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";

/**
 * GET /api/items/share/[id]
 * Get a single share item by ID
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item ID is required",
        },
        { status: 400 }
      );
    }

    const result = await ShareItemsService.getItemById(id);

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
    console.error("Get share item error:", error);
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
 * PUT /api/items/share/[id]
 * Update a share item (requires authentication and ownership)
 */
export const PUT = withAuth(
  async (
    req: NextRequest,
    user: JwtPayload,
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (!context) {
        return NextResponse.json(
          { success: false, error: "Invalid request context" },
          { status: 400 }
        );
      }

      const { id } = await context.params;

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Item ID is required",
          },
          { status: 400 }
        );
      }

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

      const updates: {
        title?: string;
        description?: string;
        category?: string;
        location?: string;
        offerType?: "free" | "sale";
        condition?: "new" | "like-new" | "good" | "fair";
        price?: number;
        tags?: string[];
        imageUrl?: string;
      } = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (category !== undefined) updates.category = category;
      if (location !== undefined) updates.location = location;
      if (offerType !== undefined) updates.offerType = offerType;
      if (condition !== undefined) updates.condition = condition;
      if (price !== undefined) updates.price = price;
      if (tags !== undefined) updates.tags = tags;
      if (imageUrl !== undefined) updates.imageUrl = imageUrl;

      const result = await ShareItemsService.updateItem({
        id,
        userId: user.userId,
        updates,
      });

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
      console.error("Update share item error:", error);

      if (error instanceof Error && error.message.includes("permission")) {
        return NextResponse.json(
          {
            success: false,
            error: "You don't have permission to perform this action",
          },
          { status: 403 }
        );
      }

      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/items/share/[id]
 * Delete a share item (requires authentication and ownership)
 */
export const DELETE = withAuth(
  async (
    req: NextRequest,
    user: JwtPayload,
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (!context) {
        return NextResponse.json(
          { success: false, error: "Invalid request context" },
          { status: 400 }
        );
      }

      const { id } = await context.params;

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Item ID is required",
          },
          { status: 400 }
        );
      }

      const result = await ShareItemsService.deleteItem({
        id,
        userId: user.userId,
      });

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
      console.error("Delete share item error:", error);

      if (error instanceof Error && error.message.includes("permission")) {
        return NextResponse.json(
          {
            success: false,
            error: "You don't have permission to perform this action",
          },
          { status: 403 }
        );
      }

      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/items/share/[id]
 * Update share item status (requires authentication and ownership)
 */
export const PATCH = withAuth(
  async (
    req: NextRequest,
    user: JwtPayload,
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (!context) {
        return NextResponse.json(
          { success: false, error: "Invalid request context" },
          { status: 400 }
        );
      }

      const { id } = await context.params;

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Item ID is required",
          },
          { status: 400 }
        );
      }

      const { action, status } = await req.json();

      if (action === "update-status" && status) {
        if (!["available", "reserved", "shared"].includes(status)) {
          return NextResponse.json(
            {
              success: false,
              error: "Invalid status. Must be: available, reserved, or shared",
            },
            { status: 400 }
          );
        }

        const result = await ShareItemsService.updateStatus({
          id,
          userId: user.userId,
          status,
        });

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

      return NextResponse.json(
        {
          success: false,
          error: "Invalid action",
        },
        { status: 400 }
      );
    } catch (error) {
      console.error("Patch share item error:", error);

      if (error instanceof Error && error.message.includes("permission")) {
        return NextResponse.json(
          {
            success: false,
            error: "You don't have permission to perform this action",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 }
      );
    }
  }
);
