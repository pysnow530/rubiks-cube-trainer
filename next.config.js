/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/rubiks-cube-trainer' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/rubiks-cube-trainer/' : '',
  trailingSlash: true,
};

module.exports = nextConfig;
