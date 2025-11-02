import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware that allows all routes
// Clerk authentication will be handled at the page/API level instead
export async function middleware(request: NextRequest) {
  // For now, just allow all requests to pass through
  // Authentication will be handled in individual pages/components
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
