import { NextResponse } from "next/server";
import { logoutUser } from "@/services/auth.services";

export async function POST() {
  const result = await logoutUser();

  if (result.success && result.data) {
    return NextResponse.json(result.data, { status: result.statusCode });
  }

  return NextResponse.json(
    { error: result.error },
    { status: result.statusCode }
  );
}
