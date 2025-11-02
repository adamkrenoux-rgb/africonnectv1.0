# Vercel Deployment Guide

## Required Environment Variables

Make sure all these environment variables are set in your Vercel dashboard:

### Essential (Required)
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database
DATABASE_URL=postgresql://user:password@host:port/database
```

### Optional (Recommended)
```env
# Stripe Payments (for booking functionality)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Storage (for file uploads)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Email (for notifications)
RESEND_API_KEY=re_...

# Error Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
```

## Common Deployment Issues

### 1. Middleware Error (MIDDLEWARE_INVOCATION_FAILED)

**Cause:** Missing Clerk environment variables or Clerk middleware error

**Solution:**
1. Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set in Vercel
2. Verify Clerk keys are from the same Clerk environment (dev vs production)
3. The middleware now handles missing Clerk gracefully - the app will work but auth won't be enforced

### 2. Build Errors

**Common causes:**
- Missing environment variables causing module initialization errors
- TypeScript errors in build

**Solution:**
- Check build logs in Vercel dashboard
- Ensure all required env vars are set
- Run `npm run build` locally to catch errors early

### 3. Database Connection Errors

**Cause:** DATABASE_URL not set or incorrect

**Solution:**
- Get DATABASE_URL from Supabase project settings
- Ensure database allows connections from Vercel's IPs
- Check database connection string format

## Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from the list above
   - Make sure to add them for Production, Preview, and Development

4. **Deploy**
   - Vercel will auto-deploy on push to main
   - Or trigger manually from Vercel dashboard

5. **Check Deployment Logs**
   - Watch the build logs
   - Fix any errors that appear
   - Redeploy if needed

## Post-Deployment Checklist

- [ ] Homepage loads successfully
- [ ] Sign-in/Sign-up pages work
- [ ] API routes respond (check `/api/users/me`)
- [ ] Database connections work
- [ ] File uploads work (if Supabase configured)
- [ ] No console errors in browser
- [ ] Environment variables are set correctly

## Troubleshooting

### Check Environment Variables
In Vercel dashboard: Settings → Environment Variables

### Check Build Logs
In Vercel dashboard: Deployments → Click on deployment → View Build Logs

### Check Runtime Logs
In Vercel dashboard: Deployments → Click on deployment → View Function Logs

### Test Locally
```bash
# Copy production env vars to .env.local
# Run build locally
npm run build
npm start
```
