const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/iracing', destination: '/iracing/2026s2', permanent: true },
            { source: '/iracing/', destination: '/iracing/2026s2', permanent: true },
            { source: '/iracing/2024s1', destination: '/ir-archive/2024s1/road', permanent: true },
            { source: '/iracing/2024s1/', destination: '/ir-archive/2024s1/road', permanent: true },
            { source: '/iracing/2024s1/:path*', destination: '/ir-archive/2024s1/:path*', permanent: true },
            { source: '/ir-archive/2024s1', destination: '/ir-archive/2024s1/road', permanent: true },
            { source: '/ir-archive/2024s1/', destination: '/ir-archive/2024s1/road', permanent: true },
            { source: '/iracing/2024s2', destination: '/ir-archive/2024s2/formula', permanent: true },
            { source: '/iracing/2024s2/', destination: '/ir-archive/2024s2/formula', permanent: true },
            { source: '/iracing/2024s2/:path*', destination: '/ir-archive/2024s2/:path*', permanent: true },
            { source: '/ir-archive/2024s2', destination: '/ir-archive/2024s2/formula', permanent: true },
            { source: '/ir-archive/2024s2/', destination: '/ir-archive/2024s2/formula', permanent: true },
            { source: '/iracing/2024s3', destination: '/ir-archive/2024s3/formula', permanent: true },
            { source: '/iracing/2024s3/', destination: '/ir-archive/2024s3/formula', permanent: true },
            { source: '/iracing/2024s3/:path*', destination: '/ir-archive/2024s3/:path*', permanent: true },
            { source: '/ir-archive/2024s3', destination: '/ir-archive/2024s3/formula', permanent: true },
            { source: '/ir-archive/2024s3/', destination: '/ir-archive/2024s3/formula', permanent: true },
        ];
    },
    turbopack: {
        resolveAlias: {
            canvas: {
                browser: path.join(__dirname, 'lib/empty-module.js'),
            },
        },
    },
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
