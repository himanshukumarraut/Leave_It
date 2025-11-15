import { NextResponse } from "next/server";

// NextAuth dev client sometimes posts logs to /api/auth/_log.
// We just accept the payload and return 200 JSON so the client
// never sees an HTML 404 page (which caused the JSON parse error).

export async function POST() {
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
