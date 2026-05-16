import { NextResponse } from 'next/server';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Helper to create a JSON response with CORS headers
 */
export function corsResponse(data: any, options: ResponseInit = {}) {
  return NextResponse.json(data, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...corsHeaders,
    },
  });
}

/**
 * Common OPTIONS handler for CORS pre-flight requests
 */
export function handleOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
