/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  root: true,
  overrides: [
    {
      files: ["src/**/*.ts"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      rules: {
        "@typescript-eslint/consistent-type-imports": "warn",
      },
    },
    {
      files: ["src/**/*.test.ts"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      rules: {
        "@typescript-eslint/consistent-type-imports": "warn",
        "@typescript-eslint/no-floating-promises": "off",
      },
    },
  ],
};
