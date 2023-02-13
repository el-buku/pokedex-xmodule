/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler:{
    emotion:true
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
}

module.exports = nextConfig
