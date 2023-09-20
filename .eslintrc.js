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
    ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "vitest.config.ts"],
    rules: {
        "@typescript-eslint/non-nullable-type-assertion-style": "off"
    },
    plugins: [
        "@typescript-eslint"
    ]
};
