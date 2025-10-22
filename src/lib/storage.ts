import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface UploadOptions {
  bucket: string
  path: string
  file: File
  contentType?: string
}

export interface UploadResult {
  url: string
  path: string
  size: number
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { bucket, path, file, contentType } = options
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || file.type,
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      path: data.path,
      size: file.size
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export async function uploadMultipleFiles(
  files: File[],
  bucket: string,
  basePath: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file, index) => {
    const extension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${index}.${extension}`
    const path = `${basePath}/${fileName}`
    
    return uploadFile({
      bucket,
      path,
      file,
      contentType: file.type
    })
  })

  return Promise.all(uploadPromises)
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`)
    }

    return data.signedUrl
  } catch (error) {
    console.error('Error creating signed URL:', error)
    throw error
  }
}

// Storage buckets configuration
export const STORAGE_BUCKETS = {
  BUSINESS_PHOTOS: 'business-photos',
  BUSINESS_VIDEOS: 'business-videos',
  VERIFICATION_DOCS: 'verification-documents',
  INFLUENCER_CONTENT: 'influencer-content',
  USER_AVATARS: 'user-avatars',
  LISTING_MEDIA: 'listing-media'
} as const

// Helper functions for specific use cases
export async function uploadBusinessPhoto(file: File, businessId: string): Promise<UploadResult> {
  const extension = file.name.split('.').pop()
  const fileName = `${Date.now()}.${extension}`
  const path = `businesses/${businessId}/photos/${fileName}`
  
  return uploadFile({
    bucket: STORAGE_BUCKETS.BUSINESS_PHOTOS,
    path,
    file,
    contentType: file.type
  })
}

export async function uploadVerificationDocument(
  file: File, 
  businessId: string, 
  documentType: string
): Promise<UploadResult> {
  const extension = file.name.split('.').pop()
  const fileName = `${documentType}-${Date.now()}.${extension}`
  const path = `businesses/${businessId}/verification/${fileName}`
  
  return uploadFile({
    bucket: STORAGE_BUCKETS.VERIFICATION_DOCS,
    path,
    file,
    contentType: file.type
  })
}

export async function uploadInfluencerContent(
  file: File,
  campaignId: string,
  influencerId: string
): Promise<UploadResult> {
  const extension = file.name.split('.').pop()
  const fileName = `${Date.now()}.${extension}`
  const path = `campaigns/${campaignId}/influencers/${influencerId}/${fileName}`
  
  return uploadFile({
    bucket: STORAGE_BUCKETS.INFLUENCER_CONTENT,
    path,
    file,
    contentType: file.type
  })
}

export async function uploadUserAvatar(file: File, userId: string): Promise<UploadResult> {
  const extension = file.name.split('.').pop()
  const fileName = `avatar-${Date.now()}.${extension}`
  const path = `users/${userId}/${fileName}`
  
  return uploadFile({
    bucket: STORAGE_BUCKETS.USER_AVATARS,
    path,
    file,
    contentType: file.type
  })
}

