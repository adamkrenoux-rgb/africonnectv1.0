# Database Setup Guide

## Quick Fix for "Database connection failed" Error

You need to create a `.env.local` file in the root of your project with your Supabase Postgres connection string.

## Steps to Get Your Database URL

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (the one with URL: `wrzugsudhxwoprukojmb.supabase.co`)
3. **Navigate to**: Project Settings → Database
4. **Scroll down to "Connection string"**
5. **Select "Connection pooling"** (recommended for serverless/Next.js)
6. **Copy the URI** - it will look like:
   ```
   postgresql://postgres.wrzugsudhxwoprukojmb:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

## Create `.env.local` File

1. In the root of your project (`/Users/adamrenoux/AFRICONNECT/`), create a file named `.env.local`
2. Add the following content (replace `[YOUR-PASSWORD]` with your actual database password):

```env
# Database - Replace [YOUR-PASSWORD] with your Supabase database password
DATABASE_URL="postgresql://postgres.wrzugsudhxwoprukojmb:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Clerk Authentication (if you have these)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# OpenAI (if you have this)
OPENAI_API_KEY=your_openai_api_key

# Stripe (if you have these)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## After Creating `.env.local`

1. **Restart your dev server**:
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

2. **Push the database schema**:
   ```bash
   npx prisma db push
   ```

3. **Try the onboarding flow again**

## Finding Your Database Password

If you don't know your database password:
1. Go to Supabase Dashboard → Project Settings → Database
2. Look for "Database password" section
3. If you forgot it, you can reset it (this will require updating the connection string)

## Alternative: Direct Connection (if pooling doesn't work)

If connection pooling doesn't work, try the direct connection:
```
postgresql://postgres:[YOUR-PASSWORD]@db.wrzugsudhxwoprukojmb.supabase.co:5432/postgres
```

## Troubleshooting

- **"Connection refused"**: Check that your Supabase project is active and not paused
- **"Authentication failed"**: Verify your password is correct
- **"Database does not exist"**: Make sure you're using the correct project
- **Still getting errors**: Check the terminal/console for more detailed error messages

