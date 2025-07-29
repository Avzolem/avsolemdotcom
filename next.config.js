/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['res.cloudinary.com'],
    },

    async redirects() {
        return [
            {
                source: "/psvita",
                destination: "http://lptutoriales.es/henlo",
                permanent: true,
            },
            {
                source: "/roms",
                destination: "https://r-roms.github.io/",
                permanent: true,
            },
        ];
    },

    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                fs: false,
                path: false,
                os: false,
            },
        };
        return config;
    },
};

module.exports = nextConfig;
