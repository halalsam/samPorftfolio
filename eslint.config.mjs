import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import js from "@eslint/js";

const unusedVars = [1, {
    args: "after-used",
    argsIgnorePattern: "^_",
}];

export default defineConfig([{
    extends: [js.configs.recommended, ...next, ...nextCoreWebVitals],

    languageOptions: {
        globals: {
            React: "readonly",
        },
    },

    rules: {
        "no-unused-vars": unusedVars,
    },
}, {
    // The core rules don't understand types: TypeScript checks undefined
    // names itself, and parameter names in type signatures aren't "unused".
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
        "no-undef": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": unusedVars,
    },
}]);
