import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AFRICONNECT - Authentic African Travel & Influencer Collaborations',
  description: 'AI-powered platform connecting international community to authentic African tourism businesses and influencer collaborations.',
  keywords: 'African travel, safari tours, cultural experiences, travel influencers, tourism business, authentic Africa, AI travel planning',
  authors: [{ name: 'AFRICONNECT Team' }],
  creator: 'AFRICONNECT',
  publisher: 'AFRICONNECT',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://africonnect.com',
    title: 'AFRICONNECT - Authentic African Travel & Influencer Collaborations',
    description: 'AI-powered platform connecting international community to authentic African tourism businesses and influencer collaborations.',
    siteName: 'AFRICONNECT',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'African savannah sunset - AFRICONNECT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFRICONNECT - Authentic African Travel & Influencer Collaborations',
    description: 'AI-powered platform connecting international community to authentic African tourism businesses and influencer collaborations.',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#F59E0B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
