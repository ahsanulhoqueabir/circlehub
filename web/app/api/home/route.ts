import { HomeStatsService } from "@/services/home-stats.services";
import { NextRequest, NextResponse } from "next/server";
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;

/**
 * GET /api/home
 * Get home page data including stats and recent activity
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "5");

    // Get only stats
    if (action === "stats") {
      const result = await HomeStatsService.getStats();

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
    }

    // Get only recent activity
    if (action === "activity") {
      const result = await HomeStatsService.getRecentActivity(limit);

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
    }

    // Default: Get both stats and recent activity
    const result = await HomeStatsService.getHomeData(limit);

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
    console.error("Error in home API:", error);
    return corsResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
