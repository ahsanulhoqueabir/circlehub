import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET lost items
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("lost_items")
      .select(
        `
        *,
        profiles:user_id (name, email)
      `
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: items, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      items: items || [],
    });
  } catch (error) {
    console.error("Get lost items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new lost item
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      category,
      location,
      dateLost,
      contactInfo,
      rewardAmount,
      imageUrl,
    } = await req.json();

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !dateLost ||
      !contactInfo
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: item, error } = await supabase
      .from("lost_items")
      .insert([
        {
          user_id: user.id,
          title,
          description,
          category,
          location,
          date_lost: dateLost,
          contact_info: contactInfo,
          reward_amount: rewardAmount,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Lost item reported successfully",
      item,
    });
  } catch (error) {
    console.error("Create lost item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
