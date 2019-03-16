module.exports = {
    env: {
        browser: true,
        es6: true,
    },

    extends: ["eslint:recommended"],
    parserOptions: {
        ecmaVersion: 2017,
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },

        sourceType: "module",
    },
    rules: { "no-console": ["error", { allow: ["warn", "error", "info"] }] },
}
