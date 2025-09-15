import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintImport from 'eslint-plugin-import';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        settings: {
            "import/resolver": {
                // Ensure this works by installing:
                // npm i -D eslint-import-resolver-typescript
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
                // Helpful fallback for non-TS paths
                node: true,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'simple-import-sort': simpleImportSort,
            'import': eslintImport,
        },
        rules: {
            "no-multiple-empty-lines": ["error", { "max": 1 }],
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            "import/extensions": [
                "error",
                "ignorePackages",
                {
                    ts: "never",
                    tsx: "never",
                },
            ],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'indent': ['error', 2, { SwitchCase: 1 }],
            'no-mixed-spaces-and-tabs': 'error',
            'space-before-blocks': ['error', 'always'],
            'space-before-function-paren': ['error', 'never'],
            'space-in-parens': ['error', 'never'],
            'space-infix-ops': 'error',
            'no-trailing-spaces': 'error',
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'quotes': ['error', 'double', { avoidEscape: true }],
            'max-len': [
                'error',
                {
                    code: 80,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignorePattern: '^(?!import).*'
                },
            ],
        },
    },
);
