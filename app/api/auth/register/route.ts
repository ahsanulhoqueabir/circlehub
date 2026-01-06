import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/auth.services";
import type { RegisterRequest } from "@/types/auth.types";

export async function POST(req: NextRequest) {
  const body: RegisterRequest = await req.json();

  const result = await registerUser(body);

  if (result.success && result.data) {
    // Return success with redirect flag for frontend
    return NextResponse.json(
      {
        ...result.data,
        redirect: "/login",
      },
      { status: result.statusCode }
    );
  }

  return NextResponse.json(
    { error: result.error },
    { status: result.statusCode }
  );
}
