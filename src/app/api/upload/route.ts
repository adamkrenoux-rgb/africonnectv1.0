import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { uploadFile, uploadBusinessPhoto, uploadVerificationDocument, uploadInfluencerContent, uploadUserAvatar } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const entityId = formData.get('entityId') as string
    const documentType = formData.get('documentType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    let result

    switch (type) {
      case 'business-photo':
        result = await uploadBusinessPhoto(file, entityId)
        break
      case 'verification-document':
        if (!documentType) {
          return NextResponse.json({ error: 'Document type required' }, { status: 400 })
        }
        result = await uploadVerificationDocument(file, entityId, documentType)
        break
      case 'influencer-content':
        const campaignId = formData.get('campaignId') as string
        if (!campaignId) {
          return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
        }
        result = await uploadInfluencerContent(file, campaignId, userId)
        break
      case 'user-avatar':
        result = await uploadUserAvatar(file, userId)
        break
      default:
        return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

