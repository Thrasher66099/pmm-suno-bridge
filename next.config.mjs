/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ttf|html)$/i,
      type: 'asset/resource'
    });
    // rebrowser-playwright-core pulls in its electron launcher module, but we
    // only ever drive chromium. Stub electron so we don't ship a ~200MB
    // dependency (with its own CVEs) that is never executed.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      electron: false,
    };
    return config;
  },
  experimental: {
    serverMinification: false, // the server minification unfortunately breaks the selector class names
  },
};  

export default nextConfig;
