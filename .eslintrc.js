module.exports = {
    root: true,
    extends: [
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:prettier/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    env: {
        node: true,
        es2021: true,
    },
    ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "vite.config.ts"],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
    plugins: [
        "@typescript-eslint"
    ],
};
