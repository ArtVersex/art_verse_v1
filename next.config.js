/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Recommended for catching errors
    images: {
      // For Firebase Storage (adjust if using other CDNs)
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/**', // Accept all paths under this host
        },
      ],
      // Optionally, you can add other CDNs or static assets:
      // remotePatterns: [
      //   { protocol: 'https', hostname: 'cdn.example.com', pathname: '/**' },
      // ],
    },
    // Other settings (optional)
    // experimental: { appDir: true },
  };
  
  module.exports = nextConfig;
  