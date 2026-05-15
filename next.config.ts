import type { NextConfig } from "next";
import path from "node:path";

const backendBase = (
  process.env.NEXT_PUBLIC_CARIB_BACKEND_URL || "http://localhost:5000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    const squareSources = [
      "https://sandbox.web.squarecdn.com",
      "https://web.squarecdn.com",
      "https://*.squarecdn.com",
      "https://connect.squareupsandbox.com",
      "https://connect.squareup.com",
    ].join(" ");
    const squareConnectSources = [
      "https://pci-connect.squareupsandbox.com",
      "https://pci-connect.squareup.com",
      "https://o160250.ingest.sentry.io",
    ].join(" ");
    const squareFontSources = [
      "https://cash-f.squarecdn.com",
      "https://square-fonts-production-f.squarecdn.com",
      "https://d1g145x70srn7h.cloudfront.net",
    ].join(" ");

    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${squareSources}`,
      `style-src 'self' 'unsafe-inline' ${squareSources}`,
      `font-src 'self' data: https://fonts.gstatic.com ${squareSources} ${squareFontSources}`,
      `img-src 'self' data: blob: http://localhost:5000 http://127.0.0.1:5000 https:`,
      `connect-src 'self' http: https: ws: wss: ${squareSources} ${squareConnectSources}`,
      `frame-src 'self' ${squareSources}`,
      `child-src 'self' ${squareSources}`,
      "worker-src 'self' blob:",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/media-signup", destination: "/join-the-media-network", permanent: true },
      { source: "/media-signup/", destination: "/join-the-media-network", permanent: true },
      { source: "/join-the-network", destination: "/join-the-media-network", permanent: true },
      { source: "/join-the-network/", destination: "/join-the-media-network", permanent: true },
      { source: "/journalist-login", destination: "/login", permanent: false },
      { source: "/journalist-portal", destination: "/portal", permanent: false },
      { source: "/journalist-portal/:path*", destination: "/portal", permanent: false },
      { source: "/dashboard", destination: "/portal", permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendBase}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
