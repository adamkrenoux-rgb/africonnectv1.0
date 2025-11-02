# Clerk Authentication Setup Guide

## ✅ What's Been Implemented

### 1. **Middleware Protection**
- Routes protected by default
- Public routes configured (home, sign-in, sign-up, API webhooks)
- All dashboard routes require authentication

### 2. **User Sync to Database**
- Webhook handler: `/api/webhooks/clerk`
- User sync API: `/api/users/sync`
- Auto-creates/updates users in database when Clerk events occur

### 3. **User Helpers**
- `getCurrentUser()` - Server-side helper to get current user
- `useCurrentUser()` - Client-side hook for user data
- `UserProvider` - Component that syncs users automatically

### 4. **Settings Page**
- Connected to Clerk authentication
- Loads real user data from database
- Saves changes back to database
- Shows UserButton for profile/sign out

## 🔧 Setup Steps

### Step 1: Configure Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create or select your application
3. Get your API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Step 2: Set Up Environment Variables

Add to `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Clerk Webhook (for user sync)
CLERK_WEBHOOK_SECRET=whsec_...
```

### Step 3: Configure Clerk Webhook

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Set endpoint URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Production**: `https://your-domain.com/api/webhooks/clerk`
4. Subscribe to events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Copy the **Signing Secret** and add to `.env.local` as `CLERK_WEBHOOK_SECRET`

### Step 4: Add User Role to Clerk Metadata

When a user signs up, set their role in Clerk's public metadata:

```typescript
// In Clerk dashboard or via API
{
  role: "TRAVELER" | "BUSINESS" | "INFLUENCER" | "ADMIN"
}
```

Or handle in onboarding flow by updating Clerk user metadata.

### Step 5: Update Root Layout (Optional)

If you want to auto-sync users on every page load:

```tsx
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { UserProvider } from '@/components/UserProvider'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ClerkProvider>
  )
}
```

## 📝 Usage Examples

### Server-Side: Get Current User

```typescript
import { getCurrentUser } from '@/lib/auth-helpers'

export default async function Page() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  return <div>Welcome, {user.name}!</div>
}
```

### Client-Side: Use Current User

```tsx
'use client'
import { useCurrentUser } from '@/components/UserProvider'
import { useAuth } from '@clerk/nextjs'

export default function Component() {
  const { isSignedIn } = useAuth()
  const { dbUser, role, isLoaded } = useCurrentUser()
  
  if (!isLoaded) return <div>Loading...</div>
  
  return (
    <div>
      {isSignedIn ? (
        <div>Welcome, {dbUser?.name} (Role: {role})</div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  )
}
```

### Protect API Routes

```typescript
import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  const user = await currentUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your logic here
}
```

## 🎯 User Roles

The system supports these roles (stored in both Clerk metadata and database):

- `TRAVELER` - Default role for users browsing/booking experiences
- `BUSINESS` - Business owners listing experiences
- `INFLUENCER` - Influencers creating campaigns
- `ADMIN` - Platform administrators

Set role via Clerk dashboard or update in onboarding flow.

## 🔒 Protected Routes

Routes that require authentication:
- `/dashboard/*`
- `/businesses/dashboard/*`
- `/travelers/dashboard/*`
- `/influencers/dashboard/*`
- `/settings`

Public routes:
- `/`
- `/sign-in`
- `/sign-up`
- `/plan-trip`
- `/experiences/*`
- `/api/webhooks/*` (webhook routes)

## 🧪 Testing

1. **Test Sign Up:**
   - Go to `/sign-up`
   - Create account via Clerk
   - Check database - user should be created

2. **Test Webhook:**
   - Create user in Clerk dashboard
   - Check logs for webhook calls
   - Verify user exists in database

3. **Test Protected Routes:**
   - Try accessing `/dashboard` without signing in
   - Should redirect to `/sign-in`
   - After sign in, should access dashboard

## 🐛 Troubleshooting

**Issue: Users not syncing to database**
- Check webhook secret is set correctly
- Verify webhook endpoint is accessible
- Check Clerk dashboard for webhook delivery status
- Check server logs for errors

**Issue: Middleware blocking public routes**
- Check `publicRoutes` array in `middleware.ts`
- Ensure route patterns match exactly

**Issue: Can't access user data**
- Verify Clerk keys are set in `.env.local`
- Check user is signed in via `useAuth()`
- Ensure `UserProvider` wraps your app

## 📚 Resources

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Webhooks Guide](https://clerk.com/docs/integrations/webhooks/overview)
- [Clerk Middleware](https://clerk.com/docs/references/nextjs/auth-middleware)

