import { LostItemsService } from "@/services/lost-items.services";
import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import { UpdateLostItemRequest } from "@/types/items.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/items/lost/[id]
 * Get a single lost item by ID
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

    const result = await LostItemsService.getItemById(id);

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
      data: result.data,
    });
  } catch (error) {
    console.error("Get lost item error:", error);
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
 * PUT /api/items/lost/[id]
 * Update a lost item (requires authentication and ownership)
 */
export const PUT = withAuth(
  async (
    req: NextRequest,
    user: JwtPayload,
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (!context?.params) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing item ID",
          },
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

      const body: UpdateLostItemRequest = await req.json();

      const result = await LostItemsService.updateItem(id, user.userId, body);

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
        message: result.data?.message || "Lost item updated successfully",
        data: result.data?.item,
      });
    } catch (error) {
      console.error("Update lost item error:", error);
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
 * DELETE /api/items/lost/[id]
 * Delete a lost item (requires authentication and ownership)
 */
export const DELETE = withAuth(
  async (
    req: NextRequest,
    user: JwtPayload,
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (!context?.params) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing item ID",
          },
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

      const result = await LostItemsService.deleteItem(id, user.userId);

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
        message: result.data?.message || "Lost item deleted successfully",
      });
    } catch (error) {
      console.error("Delete lost item error:", error);
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
 * PATCH /api/items/lost/[id]
 * Partial update (e.g., mark as resolved)
 */
export const PATCH = withAuth(
  async (
    req: NextRequest,
    user: JwtPayload,
    context?: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (!context?.params) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing item ID",
          },
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

      if (action === "resolve") {
        const result = await LostItemsService.markAsResolved(
          id,
          user.userId,
          status || "found"
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
          message: result.data?.message || "Item marked as resolved",
          data: result.data?.item,
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
      console.error("Patch lost item error:", error);
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
