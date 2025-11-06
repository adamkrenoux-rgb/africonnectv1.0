'use client'

import { Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from 'lucide-react'

interface SocialLinksProps {
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    linkedin?: string
    website?: string
  }
  className?: string
}

export default function SocialLinks({ socialLinks, className = '' }: SocialLinksProps) {
  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return null
  }

  const links = [
    { key: 'facebook', icon: Facebook, url: socialLinks.facebook, label: 'Facebook' },
    { key: 'instagram', icon: Instagram, url: socialLinks.instagram, label: 'Instagram' },
    { key: 'twitter', icon: Twitter, url: socialLinks.twitter, label: 'Twitter' },
    { key: 'youtube', icon: Youtube, url: socialLinks.youtube, label: 'YouTube' },
    { key: 'linkedin', icon: Linkedin, url: socialLinks.linkedin, label: 'LinkedIn' },
    { key: 'website', icon: Globe, url: socialLinks.website, label: 'Website' }
  ].filter(link => link.url)

  if (links.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ key, icon: Icon, url, label }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors"
          aria-label={label}
        >
          <Icon className="w-5 h-5 text-white" />
        </a>
      ))}
    </div>
  )
}

