'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createCampaignSchema = z.object({
  influencerId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  targetRegion: z.string().min(1),
  deliverables: z.record(z.any()), // JSON object
  audienceDemographics: z.record(z.any()), // JSON object
  collaborationTerms: z.string().optional(),
})

const updateCampaignSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  targetRegion: z.string().min(1).optional(),
  deliverables: z.record(z.any()).optional(),
  audienceDemographics: z.record(z.any()).optional(),
  collaborationTerms: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS', 'COMPLETED']).optional(),
})

export async function createCampaign(data: z.infer<typeof createCampaignSchema>) {
  try {
    const validatedData = createCampaignSchema.parse(data)

    const campaign = await prisma.campaign.create({
      data: {
        ...validatedData,
        status: 'OPEN',
      },
      include: {
        influencer: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        }
      }
    })

    revalidatePath('/influencers/dashboard')
    revalidatePath('/businesses/dashboard/collaborations')
    return { success: true, campaign }
  } catch (error) {
    console.error('Error creating campaign:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to create campaign' 
    }
  }
}

export async function updateCampaign(data: z.infer<typeof updateCampaignSchema>) {
  try {
    const { id, ...updateData } = updateCampaignSchema.parse(data)

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        influencer: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        },
        applications: {
          include: {
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
        }
      }
    })

    revalidatePath('/influencers/dashboard')
    revalidatePath('/businesses/dashboard/collaborations')
    return { success: true, campaign }
  } catch (error) {
    console.error('Error updating campaign:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to update campaign' 
    }
  }
}

export async function getCampaignsByInfluencer(influencerId: string) {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { influencerId },
      include: {
        applications: {
          include: {
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
        },
        _count: {
          select: {
            applications: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, campaigns }
  } catch (error) {
    console.error('Error fetching influencer campaigns:', error)
    return { success: false, error: 'Failed to fetch campaigns' }
  }
}

export async function getCampaignById(id: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        influencer: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        },
        applications: {
          include: {
            business: {
              select: {
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
                    verificationStatus: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    return { success: true, campaign }
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return { success: false, error: 'Failed to fetch campaign' }
  }
}
