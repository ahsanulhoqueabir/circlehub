import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/services/auth.services";
import type { LoginRequest } from "@/types/auth.types";

export async function POST(req: NextRequest) {
  const body: LoginRequest = await req.json();

  const result = await loginUser(body);

  if (result.success && result.data) {
    return NextResponse.json(result.data, { status: result.statusCode });
  }

  return NextResponse.json(
    { error: result.error },
    { status: result.statusCode }
  );
}
