# Clerk Authentication Setup Guide

## Quick Setup

1. **Create a Clerk Account**
   - Go to https://clerk.com
   - Sign up for a free account
   - Create a new application

2. **Get Your Keys**
   - In your Clerk dashboard, go to **API Keys**
   - Copy the following:
     - `Publishable Key` (starts with `pk_test_` or `pk_live_`)
     - `Secret Key` (starts with `sk_test_` or `sk_live_`)

3. **Add Environment Variables**

   **For Local Development:**
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

   **For Vercel Deployment:**
   - Go to your Vercel project settings
   - Navigate to **Environment Variables**
   - Add both variables:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`

4. **Configure Clerk Webhook (Optional but Recommended)**
   - In Clerk dashboard, go to **Webhooks**
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook signing secret and add as `CLERK_WEBHOOK_SECRET` in environment variables

5. **Restart Your Development Server**
   ```bash
   npm run dev
   ```

## Features Enabled

Once Clerk is configured:
- ✅ User sign up and sign in
- ✅ Social login (Google, GitHub, etc.)
- ✅ Protected routes (automatic redirect to sign-in)
- ✅ User profile management
- ✅ Role-based access control
- ✅ Database user sync

## Testing Without Clerk

The app will work without Clerk keys configured, but:
- No authentication required
- All routes are accessible
- User features may be limited

## Troubleshooting

**"Middleware error" on deployment:**
- Make sure both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set in Vercel
- Redeploy after adding environment variables

**"Clerk not available" warnings:**
- Normal if Clerk keys are not configured
- App will work but without authentication

**Sign-in page not loading:**
- Check that `/sign-in` route exists (it should at `src/app/sign-in/[[...sign-in]]/page.tsx`)
- Verify ClerkProvider is wrapping your app in `src/app/layout.tsx`
