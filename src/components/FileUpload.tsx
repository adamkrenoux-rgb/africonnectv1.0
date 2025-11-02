'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Check, AlertCircle, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete: (result: UploadResult) => void
  onUploadError?: (error: string) => void
  bucket?: string
  path?: string
  userId?: string
  businessId?: string
  accept?: string
  maxSize?: number // in MB
  label?: string
  description?: string
  className?: string
  multiple?: boolean
}

export interface UploadResult {
  id: string
  filename: string
  size: number
  type: string
  url: string
  path: string
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export function FileUpload({
  onUploadComplete,
  onUploadError,
  bucket = 'user-avatars',
  path,
  userId,
  businessId,
  accept = 'image/*',
  maxSize = 10,
  label = 'Upload File',
  description,
  className = '',
  multiple = false
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    // Validate file size
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    if (multiple) {
      setFiles(prev => [...prev, ...selectedFiles])
    } else {
      setFiles(selectedFiles)
    }
    setError('')
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setError('')
  }

  const uploadFile = async (file: File): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    if (path) formData.append('path', path)
    if (userId) formData.append('userId', userId)
    if (businessId) formData.append('businessId', businessId)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
      }))
    }, 200)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      return data.data
    } catch (error: any) {
      clearInterval(progressInterval)
      delete uploadProgress[file.name]
      throw error
    } finally {
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[file.name]
          return newProgress
        })
      }, 1000)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select a file to upload')
      return
    }

    setUploadStatus('uploading')
    setError('')

    try {
      if (multiple) {
        // Upload multiple files
        const uploadPromises = files.map(file => uploadFile(file))
        const results = await Promise.all(uploadPromises)
        results.forEach(result => onUploadComplete(result))
      } else {
        // Upload single file
        const result = await uploadFile(files[0])
        onUploadComplete(result)
      }

      setUploadStatus('success')
      setFiles([])
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Reset success status after 2 seconds
      setTimeout(() => setUploadStatus('idle'), 2000)
    } catch (err: any) {
      setUploadStatus('error')
      setError(err.message || 'Upload failed. Please try again.')
      onUploadError?.(err.message || 'Upload failed')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          {label && (
            <label className="block text-sm font-medium text-white mb-2">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-400 mb-3">{description}</p>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${bucket}`}
          />
          
          <label
            htmlFor={`file-upload-${bucket}`}
            className="cursor-pointer"
          >
            <Card className="border-2 border-dashed border-gray-600 hover:border-yellow-500 transition-colors p-6 text-center bg-gray-800/50">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-300">
                Click to select or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max size: {maxSize}MB
              </p>
            </Card>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs">IMG</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs">DOC</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                    {uploadProgress[file.name] !== undefined && (
                      <div className="mt-1 w-full bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
            <Check className="w-4 h-4" />
            <p className="text-sm">Upload successful!</p>
          </div>
        )}

        {files.length > 0 && (uploadStatus === 'idle' || uploadStatus === 'error') && (
          <Button
            type="button"
            onClick={handleUpload}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {multiple ? `Upload ${files.length} Files` : 'Upload File'}
          </Button>
        )}

        {uploadStatus === 'uploading' && (
          <Button
            type="button"
            disabled
            className="w-full bg-gray-600 text-gray-300"
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </Button>
        )}
      </div>
    </div>
  )
}
