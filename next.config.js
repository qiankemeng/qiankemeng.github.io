/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    localeDetection: true
  },
  output: 'export',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
