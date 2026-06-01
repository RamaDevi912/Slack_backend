import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', '**/*.js'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
            },
        },
        rules: {
            // Google Style Guide - JavaScript
            'no-var': 'error',
            'prefer-const': 'error',
            'eol-last': ['error', 'always'],
            'indent': ['error', 2],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrors: 'none',
                },
            ],
            'no-trailing-spaces': 'error',
            'max-len': 'off',
            'camelcase': ['error', { properties: 'never' }],
            'no-console': 'off',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'space-before-function-paren': ['error', {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            }],
            'keyword-spacing': 'error',
            'space-infix-ops': 'error',
            'arrow-spacing': 'error',
            'curly': ['error', 'all'],
            'brace-style': ['error', '1tbs', { allowSingleLine: false }],
            'space-before-blocks': 'error',
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'computed-property-spacing': ['error', 'never'],
            'no-multi-spaces': 'error',
            'key-spacing': ['error', { beforeColon: false, afterColon: true }],
            'comma-spacing': 'error',
            'semi-spacing': 'error',
            'func-call-spacing': ['error', 'never'],
            'no-duplicate-imports': 'error',
            'sort-imports': ['warn', {
                ignoreCase: true,
                ignoreDeclarationSort: true,
            }],

            // TypeScript specific
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/prefer-optional-chain': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
            '@typescript-eslint/prefer-as-const': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
];
