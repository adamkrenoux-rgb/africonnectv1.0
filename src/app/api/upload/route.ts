import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Mock file upload for demo
    const uploadResult = {
      id: 'upload_' + Date.now(),
      filename: file.name,
      size: file.size,
      type: file.type,
      url: '/uploads/mock/' + file.name
    }

    return NextResponse.json({ success: true, data: uploadResult })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}