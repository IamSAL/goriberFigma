const nextConfig = {
  reactStrictMode: true,
  env: {
    SERVER_ROOT: process.env.SERVER_ROOT,
    FORM_CLIENT_ID: process.env.FORM_CLIENT_ID,
    FORM_CLIENT_SECRET: process.env.FORM_CLIENT_SECRET,
    PKCE_REDIRECT_URL: process.env.PKCE_REDIRECT_URL,
    PKCE_CLIENT_ID: process.env.PKCE_CLIENT_ID,
    PAT_CLIENT_ID: process.env.PAT_CLIENT_ID,
    PAT_CLIENT_SECRET: process.env.PAT_CLIENT_SECRET,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["en", "bn"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
