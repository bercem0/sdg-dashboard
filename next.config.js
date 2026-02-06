/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['unstats.un.org'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig

