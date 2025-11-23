# Environment Variables Setup Guide

## Step-by-Step Instructions

### 1. Get Your Clerk Keys

In your Clerk Dashboard:
1. Go to **API Keys** page: https://dashboard.clerk.com/last-active?path=api-keys
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Create `.env.local` File

Create a file named `.env.local` in the root of your project (same folder as `package.json`).

**Important:** This file is already in `.gitignore` so it won't be committed to git.

### 3. Add Your Keys

Copy and paste this template, then replace with your actual keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Clerk Webhook (Optional - set this up later)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database (if you have it)
DATABASE_URL="postgresql://username:password@localhost:5432/connexus"

# OpenAI (if you have it)
OPENAI_API_KEY=sk-your-openai-key-here
```

### 4. Save and Restart Dev Server

After saving `.env.local`:
1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. The environment variables will be loaded

### 5. Test It Works

1. Go to http://localhost:3000/sign-up
2. Try creating an account
3. You should see Clerk's sign-up form

## Quick Checklist

- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
- [ ] Added `CLERK_SECRET_KEY` (starts with `sk_`)
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Tested sign-up page works

## Important Notes

⚠️ **Never commit `.env.local` to git** - it's already in `.gitignore`

⚠️ **The publishable key** is safe to expose in frontend code (it's in the name)

⚠️ **The secret key** must stay secret - never share it or commit it

⚠️ **Use test keys** (`pk_test_`, `sk_test_`) for development

⚠️ **Use live keys** (`pk_live_`, `sk_live_`) only in production

