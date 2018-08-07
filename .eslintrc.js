module.exports = {
  plugins: ['prettier'],
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': [
      'error',
      {commonjs: true, caseSensitive: true, ignore: ['aws-sdk']},
    ],
  },
};
