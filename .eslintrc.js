module.exports = {
    extends: ['airbnb-base', 'prettier'],
    plugins: ['prettier', 'jest'],
    rules: {
        quotes: [2, 'single', { avoidEscape: true }],
        'prettier/prettier': 'error',
    },
    env: {
        'jest/globals': true,
    },
};
