'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileUpload } from '@/components/FileUpload'
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Mail, 
  Phone,
  AlertCircle,
  Shield
} from 'lucide-react'
import { useCurrentUser } from '@/components/UserProvider'

interface VerificationStatus {
  id: string
  documentType: string
  documentUrl: string
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: string
}

export default function BusinessVerificationPage() {
  const router = useRouter()
  const { dbUser, isLoaded } = useCurrentUser()
  const [business, setBusiness] = useState<any>(null)
  const [verifications, setVerifications] = useState<VerificationStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    businessLicense: null as File | null,
    governmentId: null as File | null,
    taxCertificate: null as File | null,
    insuranceCertificate: null as File | null,
    otherDocument: null as File | null,
    otherDocumentType: ''
  })

  const documentTypes = [
    { value: 'BUSINESS_LICENSE', label: 'Business License', required: true },
    { value: 'GOVERNMENT_ID', label: 'Government ID', required: true },
    { value: 'TAX_CERTIFICATE', label: 'Tax Certificate', required: false },
    { value: 'INSURANCE_CERTIFICATE', label: 'Insurance Certificate', required: false },
    { value: 'OTHER', label: 'Other Document', required: false }
  ]

  useEffect(() => {
    if (isLoaded) {
      fetchBusinessData()
      fetchVerifications()
    }
  }, [isLoaded])

  const fetchBusinessData = async () => {
    try {
      // Get user's business
      const response = await fetch('/api/businesses?userId=' + dbUser?.id)
      const data = await response.json()
      
      if (data.success && data.businesses.length > 0) {
        const userBusiness = data.businesses[0]
        setBusiness(userBusiness)
        setFormData(prev => ({
          ...prev,
          email: userBusiness.email || '',
          phone: userBusiness.phone || ''
        }))
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load business data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVerifications = async () => {
    if (!business?.id) return

    try {
      const response = await fetch(`/api/verifications?businessId=${business.id}`)
      const data = await response.json()
      
      if (data.success) {
        setVerifications(data.verifications || [])
      }
    } catch (err) {
      console.error('Failed to fetch verifications:', err)
    }
  }

  const handleFileChange = (documentType: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [documentType]: file
    }))
  }

  const uploadDocument = async (file: File, documentType: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'verification-docs')
    formData.append('businessId', business.id)
    formData.append('documentType', documentType)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to upload document')
    }

    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.email || !formData.phone) {
        throw new Error('Email and phone are required')
      }

      if (!formData.businessLicense || !formData.governmentId) {
        throw new Error('Business License and Government ID are required')
      }

      // Update business contact info
      if (business) {
        await fetch(`/api/businesses/${business.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone
          })
        })
      }

      // Upload documents and create verification records
      const uploadPromises: Promise<void>[] = []

      if (formData.businessLicense) {
        uploadPromises.push(
          uploadDocument(formData.businessLicense, 'BUSINESS_LICENSE').then(async (url) => {
            await fetch('/api/verifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: business.id,
                documentType: 'BUSINESS_LICENSE',
                documentUrl: url
              })
            })
          })
        )
      }

      if (formData.governmentId) {
        uploadPromises.push(
          uploadDocument(formData.governmentId, 'GOVERNMENT_ID').then(async (url) => {
            await fetch('/api/verifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: business.id,
                documentType: 'GOVERNMENT_ID',
                documentUrl: url
              })
            })
          })
        )
      }

      if (formData.taxCertificate) {
        uploadPromises.push(
          uploadDocument(formData.taxCertificate, 'TAX_CERTIFICATE').then(async (url) => {
            await fetch('/api/verifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: business.id,
                documentType: 'TAX_CERTIFICATE',
                documentUrl: url
              })
            })
          })
        )
      }

      if (formData.insuranceCertificate) {
        uploadPromises.push(
          uploadDocument(formData.insuranceCertificate, 'INSURANCE_CERTIFICATE').then(async (url) => {
            await fetch('/api/verifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: business.id,
                documentType: 'INSURANCE_CERTIFICATE',
                documentUrl: url
              })
            })
          })
        )
      }

      if (formData.otherDocument) {
        uploadPromises.push(
          uploadDocument(formData.otherDocument, 'OTHER').then(async (url) => {
            await fetch('/api/verifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: business.id,
                documentType: 'OTHER',
                documentUrl: url
              })
            })
          })
        )
      }

      await Promise.all(uploadPromises)

      // Refresh verifications
      await fetchVerifications()

      alert('Verification documents submitted successfully! Our team will review them within 24-48 hours.')
      router.push('/businesses/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-gray-700 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">No Business Found</h2>
          <p className="text-gray-400 mb-6">
            You need to create a business profile first before you can verify it.
          </p>
          <Link href="/business/setup">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Create Business Profile
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const hasPendingVerification = verifications.some(v => v.verificationStatus === 'PENDING')
  const isVerified = business.verificationBadge

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Africonnect
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/businesses/dashboard">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {isVerified && (
          <Card className="bg-green-900/20 border-green-500/30 p-6 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-green-400">Business Verified!</h3>
                <p className="text-gray-300 text-sm">
                  Your business has been verified and is displaying the verification badge.
                </p>
              </div>
            </div>
          </Card>
        )}

        {hasPendingVerification && !isVerified && (
          <Card className="bg-yellow-900/20 border-yellow-500/30 p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Verification Pending</h3>
                <p className="text-gray-300 text-sm">
                  Your verification documents are under review. We'll notify you once the review is complete.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Business Verification</h1>
          </div>
          <p className="text-xl text-gray-300">
            Verify your business to build trust with travelers and get the verification badge
          </p>
        </div>

        {/* Verification Requirements */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Verification Requirements</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Valid business license or registration certificate</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Government-issued ID of business owner</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Verified email and phone number</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Review typically takes 24-48 hours</span>
            </li>
          </ul>
        </Card>

        {/* Verification Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-6">Verification Documents</h3>
            
            <div className="space-y-6">
              {documentTypes.map((docType) => {
                const fieldName = docType.value.toLowerCase().replace('_', '') as keyof typeof formData
                const file = formData[fieldName] as File | null

                return (
                  <div key={docType.value}>
                    <label className="block text-white font-semibold mb-2">
                      {docType.label} {docType.required && <span className="text-red-400">*</span>}
                    </label>
                    <div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              alert('File size must be less than 10MB')
                              return
                            }
                            handleFileChange(fieldName, file)
                          }
                        }}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
                      />
                    </div>
                    {file && (
                      <p className="text-gray-400 text-sm mt-2">
                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Existing Verifications */}
          {verifications.length > 0 && (
            <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Submitted Documents</h3>
              <div className="space-y-3">
                {verifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">
                          {verification.documentType.replace('_', ' ')}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Submitted {new Date(verification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      {verification.verificationStatus === 'VERIFIED' && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {verification.verificationStatus === 'PENDING' && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )}
                      {verification.verificationStatus === 'REJECTED' && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {error && (
            <Card className="bg-red-900/20 border-red-500/30 p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || isVerified}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
            <Link href="/businesses/dashboard">
              <Button variant="outline" className="border-gray-600 text-gray-300">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

