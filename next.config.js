/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Optimize for production
    eslint: {
        ignoreDuringBuilds: true,
    },
    
    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: '**.githubusercontent.com',
            },
        ],
    },

    // Redirects
    async redirects() {
        return [
            {
                source: "/psvita",
                destination: "https://psvita.hacks.guide/",
                permanent: true,
            },
            {
                source: "/roms",
                destination: "https://r-roms.github.io/",
                permanent: true,
            },
        ];
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                ],
            },
        ];
    },

    // Webpack optimization
    webpack: (config, { isServer }) => {
        // Fallbacks for client-side
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
            };
        }
        
        // Bundle analyzer in development
        if (process.env.ANALYZE === 'true') {
            const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    reportFilename: './analyze.html',
                    openAnalyzer: true,
                })
            );
        }
        
        return config;
    },
};

module.exports = nextConfig;
