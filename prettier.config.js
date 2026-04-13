/** Prettier config (previously extended @vercel/style-guide/prettier; dropped for ESLint 9 + Next 16 compatibility). */
module.exports = {
    printWidth: 120,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'all',
    semi: true,
    arrowParens: 'always',
    plugins: ['prettier-plugin-tailwindcss'],
};
