import { NextResponse } from "next/server";
import { initiateGoogleAuth } from "@/services/auth.services";

export async function POST() {
  const result = await initiateGoogleAuth();

  if (result.success && result.data) {
    return NextResponse.json(result.data, { status: result.statusCode });
  }

  return NextResponse.json(
    { error: result.error },
    { status: result.statusCode }
  );
}
