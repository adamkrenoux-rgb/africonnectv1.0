# Auth.js Setup Guide for AFRICONNECT

## Installation

```bash
npm install next-auth@beta
npm install bcryptjs @types/bcryptjs  # For password hashing
npm install nodemailer  # For email verification (optional)
```

## 1. Create Auth Configuration

**File:** `src/lib/auth.ts`

```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error("No user found")
        }

        // If using password auth, verify password
        // const isPasswordValid = await bcrypt.compare(
        //   credentials.password,
        //   user.passwordHash
        // )

        // if (!isPasswordValid) {
        //   throw new Error("Invalid password")
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.profilePicture
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! }
        })
        session.user.id = dbUser?.id
        session.user.role = dbUser?.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  },
  pages: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    error: '/auth/error'
  },
  session: {
    strategy: "jwt"
  }
}
```

## 2. Create API Route Handler

**File:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

## 3. Update Prisma Schema

Add password field to User model:

```prisma
model User {
  // ... existing fields
  passwordHash     String?  // Optional if using OAuth only
  emailVerified   DateTime?
  // ... rest of fields
}
```

## 4. Create Auth Utilities

**File:** `src/lib/auth-utils.ts`

```typescript
import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
```

## 5. Update Signup Route

**File:** `src/app/api/auth/signup/route.ts`

```typescript
import { hashPassword } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const { email, password, name, role } = await request.json()
  
  const passwordHash = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      name,
      role: role || 'TRAVELER',
      passwordHash
    }
  })
  
  // Send verification email here
  
  return Response.json({ user })
}
```

## 6. Update Middleware

**File:** `src/middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add role-based access control here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/businesses/:path*", "/influencers/:path*"]
}
```

## Pros & Cons Summary

**Auth.js Pros:**
- ✅ Free forever
- ✅ Full control
- ✅ No vendor lock-in
- ✅ Uses your existing database
- ✅ Open source community

**Auth.js Cons:**
- ❌ More setup and code to write
- ❌ Need to handle email verification yourself
- ❌ Need to handle password reset yourself
- ❌ More security responsibility
- ❌ More maintenance

**My Recommendation:**
Since you already have Clerk installed and it's working, I'd suggest **sticking with Clerk** unless you have specific requirements that Clerk doesn't meet (like needing self-hosted auth or avoiding vendor lock-in).

