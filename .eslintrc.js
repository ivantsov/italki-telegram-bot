module.exports = {
  parser: 'babel-eslint',
  plugins: ['prettier'],
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
