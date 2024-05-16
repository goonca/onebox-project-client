require('dotenv').config({ path: `.${process.env.ENVIRONMENT}` });
const { BLOG_URL } = process.env;
const path = require('path');
/*
module.exports = {
  //output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  experimental: {
    appDir: true
  }
};*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`
      },
      {
        source: '/blog',
        destination: `${BLOG_URL}/blog`
      },
      {
        source: '/blog/:path*',
        destination: `${BLOG_URL}/blog/:path*`
      }
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  }
};

//module.exports = nextConfig;

module.exports = {
  ...nextConfig,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  //output: 'standalone',
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/dashboard/:path',
        destination: '/dashboard?path=:path',
        permanent: true
      },
      {
        source: '/dashboard/:path/:path1',
        destination: '/dashboard?path=:path/:path1',
        permanent: true
      },
      {
        source: '/dashboard/:path/:path1/:path2',
        destination: '/dashboard?path=:path/:path1/:path2',
        permanent: true
      }
    ];
  }
};
