import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  rules: {
    // ESLint rules
    'no-unused-vars': 'warn',
    'no-console': 'off',
    
    // TypeScript-specific rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Prettier integration
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        trailingComma: 'none',
        semi: true,
        arrowParens: 'always',
      }
    ]
  },
  plugins: {
    prettier: eslintPluginPrettier,
    '@typescript-eslint': tseslint.plugin
  }
];
