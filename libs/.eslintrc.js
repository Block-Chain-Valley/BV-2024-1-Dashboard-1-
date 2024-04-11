module.exports = {
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['!**/*', '__generated__/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'no-param-reassign': 0,
        'consistent-return': 0,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
