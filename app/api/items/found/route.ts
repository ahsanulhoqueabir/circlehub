import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET found items
export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("found_items")
      .select(
        `
        *,
        profiles:user_id (name, email)
      `
      )
      .eq("status", "available")
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
    console.error("Get found items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new found item
export async function POST(request: Request) {
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
      dateFound,
      contactInfo,
      imageUrl,
    } = await request.json();

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !dateFound ||
      !contactInfo
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: item, error } = await supabase
      .from("found_items")
      .insert([
        {
          user_id: user.id,
          title,
          description,
          category,
          location,
          date_found: dateFound,
          contact_info: contactInfo,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Found item reported successfully",
      item,
    });
  } catch (error) {
    console.error("Create found item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
