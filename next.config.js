const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
