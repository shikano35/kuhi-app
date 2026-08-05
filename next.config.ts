import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  ...(isProd && {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com static.cloudflareinsights.com challenges.cloudflare.com",
                "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
                "font-src 'self' fonts.gstatic.com",
                "img-src 'self' data: blob: https: http://localhost:3000",
                "connect-src 'self' api.kuhi.jp *.googleapis.com *.google-analytics.com *.cloudflareinsights.com challenges.cloudflare.com https://analytics.google.com",
                "frame-src 'self' *.google.com challenges.cloudflare.com",
                "object-src 'none'",
                "upgrade-insecure-requests"
              ].join("; "),
            },
            { key: "X-XSS-Protection", value: "1; mode=block" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          ],
        },
      ];
    },
  }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.kuhi.jp',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'colbase.nich.go.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.go.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.jpsearch.go.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'iss.ndl.go.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'dl.ndl.go.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.ndl.go.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'bunka.nii.ac.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.ac.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.fujibi.or.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'image.tnm.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.or.jp',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.tokyo',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.museum',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.jp',
        pathname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default bundleAnalyzer(nextConfig);