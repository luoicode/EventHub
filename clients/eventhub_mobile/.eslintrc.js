module.exports = {
  root: true,
  extends: '@react-native',
  "plugins": ["react-hooks"],
  rules: {
    'prettier/prettier': 0,
    'react-native/no-inline-styles': 0,
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    "quotes": [1, "single"]

  },
  requireConfigFile: false,
};
