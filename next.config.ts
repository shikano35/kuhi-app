import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.kuhiapi.com',
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