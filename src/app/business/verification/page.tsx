'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DocumentType } from '@prisma/client'
import { useRouter } from 'next/navigation'

export default function BusinessVerificationPage() {
  const [documents, setDocuments] = useState<Array<{
    type: DocumentType
    url: string
    status: string
  }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get business ID from user's business
    fetch('/api/businesses')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setBusinessId(data.data[0].id)
        }
      })
  }, [])

  const handleFileUpload = async (type: DocumentType, file: File) => {
    if (!businessId) return

    setIsLoading(true)
    try {
      // In a real implementation, you would upload to S3/Supabase Storage
      // For now, we'll simulate with a mock URL
      const mockUrl = `https://storage.example.com/verification/${type}/${Date.now()}.pdf`
      
      const response = await fetch('/api/verifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          documentType: type,
          documentUrl: mockUrl
        }),
      })

      if (response.ok) {
        setDocuments(prev => [...prev, {
          type,
          url: mockUrl,
          status: 'PENDING'
        }])
      }
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const documentTypes = [
    {
      type: 'BUSINESS_LICENSE' as DocumentType,
      title: 'Business License',
      description: 'Official business registration or license',
      icon: '📄'
    },
    {
      type: 'TAX_REGISTRATION' as DocumentType,
      title: 'Tax Registration',
      description: 'Tax registration certificate or number',
      icon: '🧾'
    },
    {
      type: 'GOVERNMENT_ID' as DocumentType,
      title: 'Government ID',
      description: 'Valid government-issued identification',
      icon: '🆔'
    },
    {
      type: 'WEBSITE' as DocumentType,
      title: 'Website',
      description: 'Business website URL',
      icon: '🌐'
    },
    {
      type: 'SOCIAL_PROFILE' as DocumentType,
      title: 'Social Media Profile',
      description: 'Business social media profiles',
      icon: '📱'
    },
    {
      type: 'CUSTOMER_REVIEWS' as DocumentType,
      title: 'Customer Reviews',
      description: 'External customer reviews or testimonials',
      icon: '⭐'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-africa-earth mb-4">✅ Business Verification</h1>
          <p className="text-xl text-gray-600">
            Get verified to earn the "✅ Verified Local Partner" badge and boost your visibility
          </p>
        </div>

        {/* Verification Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Get Verified?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-semibold mb-2">Increased Visibility</h3>
                <p className="text-sm text-gray-600">Verified businesses appear higher in search results</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <h3 className="font-semibold mb-2">Trust & Safety</h3>
                <p className="text-sm text-gray-600">Build trust with travelers through verification</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <h3 className="font-semibold mb-2">More Bookings</h3>
                <p className="text-sm text-gray-600">Verified businesses typically get 40% more bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Verification Documents</CardTitle>
            <p className="text-gray-600">Upload at least 2 documents to get verified</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {documentTypes.map((doc) => (
                <div key={doc.type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{doc.icon}</div>
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {documents.find(d => d.type === doc.type) ? (
                        <span className="text-green-600 font-medium">✓ Uploaded</span>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(doc.type, file)
                            }}
                            disabled={isLoading}
                          />
                          <Button size="sm" variant="outline" disabled={isLoading}>
                            {isLoading ? 'Uploading...' : 'Upload'}
                          </Button>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Verification Process</h4>
              <ol className="text-blue-700 text-sm space-y-1">
                <li>1. Upload at least 2 verification documents</li>
                <li>2. Our team will review your documents within 24-48 hours</li>
                <li>3. You'll receive an email notification of the result</li>
                <li>4. If approved, you'll get the "✅ Verified Local Partner" badge</li>
              </ol>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button 
                className="bg-africa-earth hover:bg-africa-earth/90"
                disabled={documents.length < 2}
              >
                Submit for Review ({documents.length}/2 documents)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

