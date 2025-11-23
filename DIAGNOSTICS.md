# Troubleshooting Guide

## AI Concierge Not Working

1. **Check if OpenAI API key is loaded:**
   - Visit: http://localhost:3000/api/test/openai
   - This will show if the API key is detected and test a simple call

2. **Check server logs:**
   - Look for `[AI Helper]` messages in your terminal
   - Should see: "OpenAI API key found, attempting API call"

3. **Restart your dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## Sign-Up Not Asking for Username/Password

1. **Check Clerk Dashboard:**
   - Go to: https://dashboard.clerk.com
   - Navigate to: User & Authentication → Email, Phone, Username
   - Ensure "Email" is enabled as a sign-up option
   - Ensure "Password" is enabled as an authentication method

2. **Clear browser cache/cookies:**
   - You might be signed in from a previous session
   - Try incognito/private browsing mode

3. **Check the sign-up URL:**
   - Should be: http://localhost:3000/sign-up
   - Should show Clerk's sign-up form with email/password fields
