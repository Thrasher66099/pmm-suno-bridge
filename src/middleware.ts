import { NextResponse, NextRequest } from "next/server";

/**
 * Optional shared-secret auth for all /api/* routes.
 *
 * If the SUNO_API_SECRET environment variable is set (non-empty), every request
 * to /api/* must include an `Authorization: Bearer <SUNO_API_SECRET>` header,
 * otherwise it is rejected with 401. If SUNO_API_SECRET is unset/empty, requests
 * pass through unchanged (matching upstream's open behavior).
 *
 * Non-API paths (e.g. the docs homepage) are never affected — see `config.matcher`.
 */
export function middleware(req: NextRequest) {
  const secret = process.env.SUNO_API_SECRET;

  // No secret configured -> behave as before (open).
  if (!secret) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;

  if (authHeader !== expected) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Protect every route under /api. Non-API paths stay open.
  matcher: ["/api/:path*"],
};
