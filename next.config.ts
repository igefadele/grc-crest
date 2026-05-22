import type { NextConfig } from 'next'

/**
 * Next.js 15 configuration.
 * - Turbopack is enabled by default in dev via `next dev --turbopack`
 * - React 19 strict mode enabled
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow the /api/ai proxy route to call external LLM APIs server-side.
  // API keys are injected via environment variables — never sent to the browser.
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
}

export default nextConfig
