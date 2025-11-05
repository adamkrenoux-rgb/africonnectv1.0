/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    // Tell webpack to ignore @sentry/nextjs if it's not installed
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['@sentry/nextjs'] = false
    return config
  },
}

module.exports = nextConfig
