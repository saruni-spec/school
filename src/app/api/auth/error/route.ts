// app/api/auth/error/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Extract error from search params
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get("error");

  // Log the error for debugging
  console.error("Authentication Error:", error);

  // Construct a new URL for redirection with error as a query parameter
  const url = new URL("/login", request.url);
  if (error) {
    url.searchParams.set("error", error);
  }

  // Redirect to login page
  return NextResponse.redirect(url);
}
