import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase with service role key for server-side uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// If Supabase is not configured, use mock uploads
const useMock = !supabaseUrl || !supabaseServiceKey

const supabase = useMock ? null : createClient(supabaseUrl, supabaseServiceKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// File type validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface UploadRequest {
  file: File
  bucket: string
  path: string
  userId?: string
  businessId?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'user-avatars'
    const customPath = formData.get('path') as string | null
    const userId = formData.get('userId') as string | null
    const businessId = formData.get('businessId') as string | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      )
    }

    // Validate file type based on bucket
    if (bucket.includes('photo') || bucket === 'user-avatars' || bucket === 'listing-media') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF' },
          { status: 400 }
        )
      }
    } else if (bucket === 'verification-documents') {
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid document type. Allowed: PDF, JPEG, PNG' },
          { status: 400 }
        )
      }
    }

    // If Supabase is not configured, return mock response
    if (useMock || !supabase) {
      const mockResult = {
        id: `upload_${Date.now()}`,
        filename: file.name,
        size: file.size,
        type: file.type,
        url: `/uploads/mock/${file.name}`,
        path: `mock/${file.name}`
      }
      
      return NextResponse.json({
        success: true,
        data: mockResult,
        message: 'Upload successful (mock mode - configure Supabase for real uploads)'
      })
    }

    // Generate file path
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 9)
    const fileName = `${timestamp}-${randomId}.${extension}`
    
    let uploadPath: string
    if (customPath) {
      uploadPath = `${customPath}/${fileName}`
    } else if (businessId) {
      uploadPath = `businesses/${businessId}/${bucket}/${fileName}`
    } else if (userId) {
      uploadPath = `users/${userId}/${fileName}`
    } else {
      uploadPath = `uploads/${fileName}`
    }

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(uploadPath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path)

    const result = {
      id: uploadData.id || `upload_${timestamp}`,
      filename: file.name,
      size: file.size,
      type: file.type,
      url: urlData.publicUrl,
      path: uploadData.path
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'File uploaded successfully'
    })

  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE endpoint for removing files
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket')
    const path = searchParams.get('path')

    if (!bucket || !path) {
      return NextResponse.json(
        { success: false, error: 'Bucket and path are required' },
        { status: 400 }
      )
    }

    // If Supabase is not configured, return success (mock)
    if (useMock || !supabase) {
      return NextResponse.json({
        success: true,
        message: 'File deleted (mock mode)'
      })
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return NextResponse.json(
        { success: false, error: `Delete failed: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}