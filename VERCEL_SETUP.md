# Vercel Deployment Setup Guide

## Prerequisites
- GitHub repository is pushed and up to date
- Vercel account (sign up at https://vercel.com)

## Step 1: Create New Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `adamkrenoux-rgb/africonnectv1.0`
4. Click "Import"

## Step 2: Configure Project Settings

### Project Name
- Name: `africonnect` (or your preferred name)

### Framework Preset
- Framework Preset: **Next.js** (should auto-detect)

### Root Directory
- Root Directory: `./` (default)

### Build and Output Settings
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

## Step 3: Environment Variables

Add the following environment variables in Vercel:

### Required Environment Variables

1. **Database**
   ```
   DATABASE_URL=your_supabase_postgres_connection_string
   ```

2. **Clerk Authentication**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

3. **OpenAI (for AI features)**
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Stripe (for payments)**
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

### Optional Environment Variables

- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://africonnect.vercel.app`)
- `NODE_ENV=production`

## Step 4: Add Environment Variables in Vercel

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add each variable:
   - **Key**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The actual value
   - **Environment**: Select all (Production, Preview, Development)
3. Click **Save**

## Step 5: Deploy

1. Click **Deploy** button
2. Wait for the build to complete
3. Your app will be live at `https://your-project-name.vercel.app`

## Step 6: Post-Deployment Checklist

### Database Setup
1. Run Prisma migrations on production:
   ```bash
   npx prisma migrate deploy
   ```
   Or use Vercel's build command to include it:
   ```bash
   npm run build && npx prisma migrate deploy
   ```

### Update Clerk Redirect URLs
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Navigate to **Paths** → **Redirect URLs**
3. Add your Vercel production URL:
   - `https://your-project-name.vercel.app`
   - `https://your-project-name.vercel.app/api/auth/callback/clerk`

### Update Stripe Webhooks
1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Add webhook endpoint:
   - URL: `https://your-project-name.vercel.app/api/stripe/webhook`
   - Events: Select all payment-related events

## Step 7: Custom Domain (Optional)

1. In Vercel project, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct build scripts

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if Supabase allows connections from Vercel IPs
- Ensure database is accessible from the internet

### Authentication Not Working
- Verify Clerk keys are correct
- Check redirect URLs in Clerk dashboard
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set

### AI Features Not Working
- Check OpenAI API key is set
- Verify API key has credits/quota
- Check server logs for OpenAI errors

## Useful Commands

```bash
# View deployment logs
vercel logs

# Deploy manually
vercel --prod

# Check environment variables
vercel env ls
```

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Check database connection and migrations

