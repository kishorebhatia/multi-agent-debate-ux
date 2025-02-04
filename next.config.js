/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // Temporarily disable SWC minification
  webpack: (config, { isServer }) => {
    // Add WebAssembly support
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    
    // Optimize for WebContainer environment
    config.optimization = {
      ...config.optimization,
      minimize: false // Disable minimization for better compatibility
    }

    return config
  }
}

module.exports = nextConfig
