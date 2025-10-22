'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createApplicationSchema = z.object({
  campaignId: z.string(),
  businessId: z.string(),
  proposalText: z.string().min(1),
  contentSamples: z.record(z.any()).optional(), // JSON object
  aiInsights: z.record(z.any()).optional(), // JSON object
  proposedPrice: z.number().positive().optional(),
})

const updateApplicationStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
})

export async function submitApplication(data: z.infer<typeof createApplicationSchema>) {
  try {
    const validatedData = createApplicationSchema.parse(data)

    const application = await prisma.application.create({
      data: {
        ...validatedData,
        status: 'PENDING',
      },
      include: {
        campaign: {
          select: {
            title: true,
            description: true,
            targetRegion: true,
            influencer: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        business: {
          select: {
            businessName: true,
            location: true,
            city: true,
            country: true,
            businessType: true,
            verificationBadge: true,
            trustScore: true,
          }
        }
      }
    })

    revalidatePath('/businesses/dashboard/collaborations')
    revalidatePath('/influencers/dashboard')
    return { success: true, application }
  } catch (error) {
    console.error('Error submitting application:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to submit application' 
    }
  }
}

export async function updateApplicationStatus(data: z.infer<typeof updateApplicationStatusSchema>) {
  try {
    const { id, status } = updateApplicationStatusSchema.parse(data)

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        campaign: {
          select: {
            title: true,
            influencer: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        business: {
          select: {
            businessName: true,
            location: true,
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }
      }
    })

    revalidatePath('/businesses/dashboard/collaborations')
    revalidatePath('/influencers/dashboard')
    return { success: true, application }
  } catch (error) {
    console.error('Error updating application status:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to update application status' 
    }
  }
}

export async function getApplicationsByBusiness(businessId: string) {
  try {
    const applications = await prisma.application.findMany({
      where: { businessId },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            description: true,
            targetRegion: true,
            status: true,
            influencer: {
              select: {
                name: true,
                email: true,
                verificationStatus: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, applications }
  } catch (error) {
    console.error('Error fetching business applications:', error)
    return { success: false, error: 'Failed to fetch applications' }
  }
}

export async function getApplicationsByCampaign(campaignId: string) {
  try {
    const applications = await prisma.application.findMany({
      where: { campaignId },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            location: true,
            city: true,
            country: true,
            businessType: true,
            verificationBadge: true,
            trustScore: true,
            user: {
              select: {
                name: true,
                email: true,
                verificationStatus: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, applications }
  } catch (error) {
    console.error('Error fetching campaign applications:', error)
    return { success: false, error: 'Failed to fetch applications' }
  }
}
