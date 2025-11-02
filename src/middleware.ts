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
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Allow public routes
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // Check if Clerk is configured
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      // If Clerk is not configured, allow all routes (for development/testing)
      console.warn('Clerk not configured - allowing all routes');
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
  } catch (error: any) {
    // Log error but don't crash - allow request to proceed if Clerk fails
    console.error('Middleware error:', error);
    
    // If it's a public route, allow it anyway
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }
    
    // For protected routes, allow access if Clerk is not configured
    // (This prevents the app from being completely broken if Clerk setup is incomplete)
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      return NextResponse.next();
    }
    
    // Otherwise, redirect to sign-in as a fallback
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
