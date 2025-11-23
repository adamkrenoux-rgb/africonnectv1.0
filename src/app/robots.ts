import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://connexus.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/settings/',
          '/auth/',
          '/admin/',
          '/bookings/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

