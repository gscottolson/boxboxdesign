/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
    images: {
        unoptimized: true,
    },
    ...(process.env.NODE_ENV === 'development' && {
        experimental: {
            webpackBuildWorker: false,
        },
        webpack: (config) => {
            config.resolve.alias.canvas = false;
            return config;
        },
    }),
}