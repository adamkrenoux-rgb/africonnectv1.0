import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that are public (no authentication required)
  publicRoutes: [
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
    '/api/auth/signup', // Keep direct signup for admin/testing
  ],
  // Routes that require authentication
  ignoredRoutes: [
    '/api/webhooks/clerk', // Allow webhook without auth
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
