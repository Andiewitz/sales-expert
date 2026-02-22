module.exports = {
    extends: ['expo', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': 'warn',
        'react/prop-types': 'off',
        'react-native/no-inline-styles': 'off',
    },
};
