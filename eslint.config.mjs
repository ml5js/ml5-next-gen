import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "spaced-comment": ["error", "always"],
      "capitalized-comments": ["error", "always"],
    },
  },
  {
    ignores: ["dist/*", "tests/coverage/*"],
  },
  eslintConfigPrettier,
]);
