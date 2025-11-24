'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Collaboration {
  id: string
  status: string
  agreedPrice: number
  deliverables: any
  timeline: string
  campaign: {
    title: string
    description: string
    influencer: {
      name: string
      profileImage?: string
    }
  }
  application: {
    business: {
      businessName: string
      user: {
        name: string
        profileImage?: string
      }
    }
  }
}

export default function CollaborationPage({ params }: { params: { id: string } }) {
  const [collaboration, setCollaboration] = useState<Collaboration | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch collaboration details
    fetch(`/api/collaborations/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCollaboration(data.data)
        }
      })
      .catch(error => {
        console.error('Error fetching collaboration:', error)
      })
  }, [params.id])

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/collaborations/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setCollaboration(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating collaboration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentSubmission = async (contentUrls: string[]) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/collaborations/${params.id}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentUrls }),
      })

      if (response.ok) {
        setCollaboration(prev => prev ? { ...prev, status: 'CONTENT_SUBMITTED' } : null)
      }
    } catch (error) {
      console.error('Error submitting content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!collaboration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-africa-earth mx-auto mb-4"></div>
          <p>Loading collaboration...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'CONTENT_SUBMITTED': return 'bg-purple-100 text-purple-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'DISPUTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 'Pending Payment'
      case 'IN_PROGRESS': return 'In Progress'
      case 'CONTENT_SUBMITTED': return 'Content Submitted'
      case 'COMPLETED': return 'Completed'
      case 'DISPUTED': return 'Disputed'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-africa-earth mb-4">🤝 Collaboration Details</h1>
          <div className="flex items-center justify-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(collaboration.status)}`}>
              {getStatusText(collaboration.status)}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">${collaboration.agreedPrice}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{collaboration.campaign.title}</h3>
                  <p className="text-gray-600">{collaboration.campaign.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Influencer</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {collaboration.campaign.influencer.profileImage ? (
                        <Image 
                          src={collaboration.campaign.influencer.profileImage} 
                          alt={collaboration.campaign.influencer.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{collaboration.campaign.influencer.name}</p>
                      <p className="text-sm text-gray-600">Travel Influencer</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Business Partner</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {collaboration.application.business.user.profileImage ? (
                        <Image 
                          src={collaboration.application.business.user.profileImage} 
                          alt={collaboration.application.business.user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600">🏢</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{collaboration.application.business.businessName}</p>
                      <p className="text-sm text-gray-600">{collaboration.application.business.user.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collaboration Details */}
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Agreed Price</h4>
                  <p className="text-2xl font-bold text-africa-earth">${collaboration.agreedPrice}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Deliverables</h4>
                  <div className="text-sm space-y-1">
                    {collaboration.deliverables.posts > 0 && (
                      <p>• {collaboration.deliverables.posts} Posts</p>
                    )}
                    {collaboration.deliverables.reels > 0 && (
                      <p>• {collaboration.deliverables.reels} Reels</p>
                    )}
                    {collaboration.deliverables.stories > 0 && (
                      <p>• {collaboration.deliverables.stories} Stories</p>
                    )}
                    {collaboration.deliverables.other && (
                      <p>• {collaboration.deliverables.other}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-sm text-gray-600">{collaboration.timeline}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">💰 Payment Protection</h4>
                  <p className="text-blue-700 text-sm">
                    Payment is held in escrow until content is delivered and approved. 
                    Africonnect takes a 12% commission on successful collaborations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaboration.status === 'PENDING_PAYMENT' && (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => handleStatusUpdate('IN_PROGRESS')}
                      className="bg-africa-earth hover:bg-africa-earth/90"
                      disabled={isLoading}
                    >
                      Start Collaboration
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusUpdate('DISPUTED')}
                      disabled={isLoading}
                    >
                      Report Issue
                    </Button>
                  </div>
                )}

                {collaboration.status === 'IN_PROGRESS' && (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => handleContentSubmission(['https://example.com/content1', 'https://example.com/content2'])}
                      className="bg-africa-earth hover:bg-africa-earth/90"
                      disabled={isLoading}
                    >
                      Submit Content
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusUpdate('DISPUTED')}
                      disabled={isLoading}
                    >
                      Report Issue
                    </Button>
                  </div>
                )}

                {collaboration.status === 'CONTENT_SUBMITTED' && (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => handleStatusUpdate('COMPLETED')}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      Approve Content
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusUpdate('DISPUTED')}
                      disabled={isLoading}
                    >
                      Request Changes
                    </Button>
                  </div>
                )}

                {collaboration.status === 'COMPLETED' && (
                  <div className="text-center">
                    <div className="text-green-600 font-semibold mb-2">✅ Collaboration Completed</div>
                    <p className="text-gray-600">Payment has been released to the influencer.</p>
                  </div>
                )}

                {collaboration.status === 'DISPUTED' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Dispute Reported</h4>
                    <p className="text-red-700 text-sm">
                      This collaboration is under review. Our support team will contact you within 24 hours.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

