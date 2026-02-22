/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed 'output: export' so dev server can proxy API calls and SSR works
  images: {
    unoptimized: true,
  },
  // Proxy /api/v1 requests to the Spring Boot backend in development
  // BACKEND_URL is read server-side (not exposed to browser), defaults to localhost:8081
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081'
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
