const { BLOG_URL } = process.env;
const path = require('path');

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
  },
  serverRuntimeConfig: {
    REACT_APP_BASE_URL: process.env
  },
  publicRuntimeConfig: {
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL
  }
};

module.exports = nextConfig;
