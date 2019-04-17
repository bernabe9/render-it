module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-shadow': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: true,
          object: true
        },
        AssignmentExpression: {
          array: true,
          object: false
        }
      }
    ]
  },
  globals: {
    window: false,
    document: false,
    page: false,
    browser: false
  },
  env: {
    es6: true,
    jest: true
  }
}
