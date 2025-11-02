import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

// Clerk webhook handler to sync users to database
export async function POST(request: NextRequest) {
  try {
    // Get headers
    const headerPayload = await headers()
    const svixId = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')

    // Verify webhook signature
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      )
    }

    // Get the body
    const payload = await request.json()
    const body = JSON.stringify(payload)

    // Verify the webhook
    const wh = new Webhook(webhookSecret)
    let evt: any

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      )
    }

    // Handle different event types
    const eventType = evt.type

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data

      const clerkId = id
      const email = email_addresses[0]?.email_address
      const name = first_name || last_name 
        ? `${first_name || ''} ${last_name || ''}`.trim() 
        : email?.split('@')[0] || null
      const profilePicture = image_url || null
      const role = ((public_metadata?.role as string)?.toUpperCase() as UserRole) || 'TRAVELER'

      if (!email) {
        console.error('No email found in Clerk user data')
        return NextResponse.json(
          { error: 'No email found' },
          { status: 400 }
        )
      }

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { clerkId }
        })

        if (existingUser) {
          // Update existing user
          const updatedUser = await prisma.user.update({
            where: { clerkId },
            data: {
              email,
              name: name || existingUser.name,
              profilePicture: profilePicture || existingUser.profilePicture,
              role: (role as UserRole) || existingUser.role,
              ...(public_metadata?.bio && { bio: public_metadata.bio as string }),
              ...(public_metadata?.country && { country: public_metadata.country as string })
            }
          })

          console.log(`User updated in database: ${updatedUser.id}`)
          return NextResponse.json({ 
            success: true, 
            message: 'User updated',
            userId: updatedUser.id 
          })
        } else {
          // Create new user
          const newUser = await prisma.user.create({
            data: {
              clerkId,
              email,
              name,
              profilePicture,
              role,
              ...(public_metadata?.bio && { bio: public_metadata.bio as string }),
              ...(public_metadata?.country && { country: public_metadata.country as string })
            }
          })

          console.log(`User created in database: ${newUser.id}`)
          return NextResponse.json({ 
            success: true, 
            message: 'User created',
            userId: newUser.id 
          })
        }
      } catch (error: any) {
        console.error('Database error:', error)
        
        // Handle unique constraint errors gracefully
        if (error.code === 'P2002') {
          // Try to find by email and update
          try {
            const userByEmail = await prisma.user.findUnique({
              where: { email }
            })

            if (userByEmail) {
              const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                  clerkId,
                  name: name || userByEmail.name,
                  profilePicture: profilePicture || userByEmail.profilePicture,
                  role: (role as UserRole) || userByEmail.role
                }
              })

              return NextResponse.json({ 
                success: true, 
                message: 'User synced',
                userId: updatedUser.id 
              })
            }
          } catch (updateError) {
            console.error('Error updating user by email:', updateError)
          }
        }

        return NextResponse.json(
          { error: 'Database operation failed', details: error.message },
          { status: 500 }
        )
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data
      
      try {
        await prisma.user.delete({
          where: { clerkId: id }
        })
        
        console.log(`User deleted from database: ${id}`)
        return NextResponse.json({ 
          success: true, 
          message: 'User deleted' 
        })
      } catch (error: any) {
        // User might not exist in our DB, that's okay
        if (error.code === 'P2025') {
          return NextResponse.json({ 
            success: true, 
            message: 'User not found in database (already deleted)' 
          })
        }
        
        console.error('Error deleting user:', error)
        return NextResponse.json(
          { error: 'Failed to delete user', details: error.message },
          { status: 500 }
        )
      }
    }

    // Return success for unhandled event types
    return NextResponse.json({ 
      success: true, 
      message: `Event ${eventType} received but not handled` 
    })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    )
  }
}

