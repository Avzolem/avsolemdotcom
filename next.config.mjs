import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic config
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  
  // SASS optimization
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },

  // PERFORMANCE OPTIMIZATIONS
  
  // 1. Image optimization
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats first
    minimumCacheTTL: 31536000, // Cache images for 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // Add external domains if needed
    dangerouslyAllowSVG: true,
  },
  
  // 3. Compression and caching
  compress: true, // Enable gzip compression
  
  // 4. Performance optimizations
  experimental: {
    optimizePackageImports: ['@once-ui-system/core'], // Tree-shake Once UI
    optimizeServerReact: true, // Optimize React server components
    webVitalsAttribution: ['CLS', 'LCP'], // Track Web Vitals
  },

  // 5. Headers for caching and performance
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 6. Bundle analyzer (optional, for development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Force single instance of React
        react: require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
      };
      return config;
    },
  }),
};

export default withMDX(nextConfig);
