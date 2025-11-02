import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if Clerk is configured
const isClerkConfigured = 
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'undefined' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== '' &&
  typeof process.env.CLERK_SECRET_KEY !== 'undefined' &&
  process.env.CLERK_SECRET_KEY !== '';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/travelers',
  '/businesses',
  '/influencers',
  '/plan-trip',
  '/experiences',
  '/sign-in',
  '/sign-up',
];

const isPublicRoute = (pathname: string): boolean => {
  // Check exact matches
  if (publicRoutes.includes(pathname)) return true;
  
  // Check pattern matches
  if (pathname.startsWith('/experiences/')) return true;
  if (pathname.startsWith('/api/webhooks')) return true;
  if (pathname.startsWith('/api/ai')) return true;
  if (pathname.startsWith('/sign-in')) return true;
  if (pathname.startsWith('/sign-up')) return true;
  if (pathname === '/api/auth/signup') return true;
  
  return false;
};

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Always allow public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // If Clerk is not configured, allow all routes (for development/testing)
    if (!isClerkConfigured) {
      console.warn('Clerk not configured - allowing all routes');
      return NextResponse.next();
    }

    // Only use Clerk if it's properly configured
    try {
      const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server");
      
      const isPublic = createRouteMatcher([
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

      return clerkMiddleware(async (auth, req) => {
        // Allow public routes
        if (isPublic(req)) {
          return NextResponse.next();
        }

        // Protect all other routes
        try {
          const { userId } = await auth();
          
          if (!userId) {
            const signInUrl = new URL('/sign-in', req.url);
            signInUrl.searchParams.set('redirect_url', req.url);
            return NextResponse.redirect(signInUrl);
          }

          return NextResponse.next();
        } catch (authError: any) {
          console.error('Auth error in middleware:', authError);
          // Allow request if auth fails (prevent total breakage)
          return NextResponse.next();
        }
      })(request);
    } catch (clerkError: any) {
      console.error('Clerk middleware error:', clerkError);
      // If Clerk fails to load, allow the request anyway
      return NextResponse.next();
    }
  } catch (error: any) {
    console.error('Middleware error:', error);
    // Always allow the request to proceed to prevent total breakage
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
