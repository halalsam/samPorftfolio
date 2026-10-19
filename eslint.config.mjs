import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import js from "@eslint/js";

export default defineConfig([{
    extends: [js.configs.recommended, ...next, ...nextCoreWebVitals],

    languageOptions: {
        globals: {
            React: "readonly",
        },
    },

    rules: {
        "no-unused-vars": [1, {
            args: "after-used",
            argsIgnorePattern: "^_",
        }],
    },
}]);
