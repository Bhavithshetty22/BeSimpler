/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEEPSEEK_API_KEY: "",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
