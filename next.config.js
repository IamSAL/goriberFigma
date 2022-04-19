const withPWA = require('next-pwa');

const nextConfig = withPWA({
  reactStrictMode: true,
  env: {
    SERVER_ROOT: process.env.SERVER_ROOT,
   
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: 'public',},
  i18n: {
    locales: ["en", "bn"],
    defaultLocale: "en",
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.resolve.alias = {
      ...config.resolve.alias,
      fabric: "fabric-pure-browser",
    
    };
    return config;
  },
});

module.exports = nextConfig;
