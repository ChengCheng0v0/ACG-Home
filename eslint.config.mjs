import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended", "prettier"), {
    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        "no-tabs": "error",
        "linebreak-style": "off",

        quotes: ["error", "double", {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],

        semi: ["error", "always"],
        "prefer-arrow-callback": "error",
        "no-unused-vars": "off",
    },
}];