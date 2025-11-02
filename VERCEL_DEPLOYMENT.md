# Vercel Deployment Guide

## Issues Fixed

✅ **Image Configuration Updated:**
- Changed from deprecated `domains` to `remotePatterns` in `next.config.js`
- Fixed broken hero image path (was referencing non-existent local file)
- All images now use working Unsplash URLs

✅ **Error Components Added:**
- Created `error.tsx` and `global-error.tsx` (required by Next.js)

## Vercel Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository: `adamkrenoux-rgb/africonnectv1.0`
4. Vercel will auto-detect Next.js

### 2. Configure Environment Variables in Vercel

**Critical:** Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dW5pdGVkLWdob3N0LTkxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_bQnmSm1LJSTHy25dHAqT1l8zuETub3fu75QQuFIla5
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database (if you have it)
DATABASE_URL=postgresql://...

# OpenAI (if you have it)
OPENAI_API_KEY=sk-...

# Clerk Webhook (set up after basic deployment works)
CLERK_WEBHOOK_SECRET=whsec_...
```

**Important:** 
- Add to **Production**, **Preview**, and **Development** environments
- After adding variables, **redeploy** your project

### 3. Configure Build Settings

Vercel should auto-detect:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### 4. Deploy

1. Vercel will auto-deploy when you push to `main` branch
2. **OR** manually trigger: Vercel Dashboard → Deployments → Redeploy

### 5. Update Vercel After Local Changes

After pushing code:
```bash
git add .
git commit -m "Your message"
git push origin main
```

Vercel will automatically:
- Detect the push
- Start a new deployment
- Build your Next.js app
- Deploy to production

### 6. Check Deployment Status

- Go to Vercel Dashboard → Your Project → Deployments
- Look for latest deployment
- Green checkmark = successful
- Click to see build logs if failed

## Troubleshooting

### Images Not Showing on Vercel

**Fixed:** Updated `next.config.js` to use `remotePatterns` instead of deprecated `domains`

### Changes Not Showing

1. **Check if code was pushed:**
   ```bash
   git log --oneline -5
   git status
   ```

2. **Check Vercel deployment:**
   - Go to Vercel Dashboard → Deployments
   - Look for latest deployment with your commit
   - Check build logs for errors

3. **Force redeploy:**
   - Vercel Dashboard → Deployments → Three dots → Redeploy

4. **Clear cache:**
   - Vercel Dashboard → Settings → General → Clear Build Cache
   - Then redeploy

### Build Failures

Common issues:
- Missing environment variables → Add them in Vercel
- TypeScript errors → Fix locally, push again
- Missing dependencies → Check `package.json`

### Environment Variables Not Working

- Make sure they're added in Vercel Dashboard (not just `.env.local`)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

## Quick Checklist

- [ ] Repository connected to Vercel
- [ ] All environment variables added in Vercel Dashboard
- [ ] Build settings configured correctly
- [ ] Code pushed to `main` branch
- [ ] Latest deployment successful (green checkmark)
- [ ] Site is live and accessible

## Next Steps After Deployment

1. **Set up Clerk Webhook:**
   - Get your Vercel deployment URL
   - In Clerk Dashboard → Webhooks
   - Add endpoint: `https://your-app.vercel.app/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook secret to Vercel environment variables

2. **Test Authentication:**
   - Go to your live site
   - Try signing up
   - Verify user is created in database

3. **Monitor Deployments:**
   - Check Vercel Dashboard regularly
   - Review build logs if deployments fail

