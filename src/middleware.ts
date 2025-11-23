import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/travelers',
  '/businesses',
  '/influencers',
  '/plan-trip',
  '/experiences(.*)',
  '/api/webhooks(.*)',
  '/api/ai(.*)',
  '/api/test(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/auth/signup',
  '/booking/success',
]);

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const fallbackMiddleware = () => NextResponse.next();

const protectedMiddleware = clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

const middlewareHandler = clerkConfigured ? protectedMiddleware : fallbackMiddleware;

export default async function middleware(req: NextRequest, event: any) {
  try {
    return await middlewareHandler(req, event);
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
