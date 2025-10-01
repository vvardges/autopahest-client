import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintImport from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
      import: eslintImport,
    },
    rules: {
      "no-multiple-empty-lines": ["error", { max: 1 }],
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
        },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // Disable core indent rule to avoid stack overflow in TSX/JSX
      // Formatting should be handled by your editor/Prettier
      indent: "off",
      "no-mixed-spaces-and-tabs": "error", // Disallow mixed spaces and tabs
      "space-before-blocks": ["error", "always"], // Require spaces before blocks
      "space-before-function-paren": ["error", "never"], // Disallow space before function parentheses
      "space-in-parens": ["error", "never"], // Disallow spaces inside parentheses
      "space-infix-ops": "error", // Require spacing around infix operators
      "no-trailing-spaces": "error", // Disallow trailing spaces
      "object-curly-spacing": ["error", "always"], // Enforce spacing inside { }
      "array-bracket-spacing": ["error", "never"], // Disallow spacing inside [ ]
      quotes: ["error", "double", { avoidEscape: true }], // Mandatory double quotes
      "max-len": [
        "error",
        {
          code: 80,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          // Only apply max‐length to lines beginning with "import"
          ignorePattern: "^(?!import).*",
        },
      ],
    },
  },
);
