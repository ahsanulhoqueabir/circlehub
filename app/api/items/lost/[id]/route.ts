import { createServerClient } from "@/lib/supabase";
import { LostItemsService } from "@/services/lost-items.services";
import { UpdateLostItemRequest } from "@/types/items.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/items/lost/[id]
 * Get a single lost item by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item ID is required",
        },
        { status: 400 }
      );
    }

    const item = await LostItemsService.getItemById(id);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
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
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createServerClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item ID is required",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body: UpdateLostItemRequest = await req.json();

    // Build update object
    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.location !== undefined) updates.location = body.location;
    if (body.dateLost !== undefined) updates.date_lost = body.dateLost;
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.status !== undefined) updates.status = body.status;

    // Update item using service
    const item = await LostItemsService.updateItem(id, user.id, updates);

    return NextResponse.json({
      success: true,
      message: "Lost item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Update lost item error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
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
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/items/lost/[id]
 * Delete a lost item (requires authentication and ownership)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createServerClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item ID is required",
        },
        { status: 400 }
      );
    }

    // Delete item using service
    await LostItemsService.deleteItem(id, user.id);

    return NextResponse.json({
      success: true,
      message: "Lost item deleted successfully",
    });
  } catch (error) {
    console.error("Delete lost item error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
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
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/items/lost/[id]
 * Partial update (e.g., mark as resolved)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createServerClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item ID is required",
        },
        { status: 400 }
      );
    }

    const { action } = await req.json();

    if (action === "resolve") {
      const item = await LostItemsService.markAsResolved(id, user.id);
      return NextResponse.json({
        success: true,
        message: "Item marked as resolved",
        data: item,
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
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
