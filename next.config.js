const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/iracing', destination: '/iracing/2026s2', permanent: true },
            { source: '/iracing/', destination: '/iracing/2026s2', permanent: true },
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
