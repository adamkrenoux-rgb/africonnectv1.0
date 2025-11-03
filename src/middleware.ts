import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/travelers',
  '/businesses',
  '/influencers',
  '/plan-trip',
  '/experiences(.*)',
  '/api/webhooks(.*)',
  '/api/ai(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/auth/signup',
  '/booking/success',
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Allow public routes
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // Check if Clerk is configured
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      // If not configured, allow all routes
      return NextResponse.next();
    }

    // Protect all other routes
    const { userId } = await auth();
    
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // If Clerk fails, allow the request (prevents total breakage)
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
