module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:solid/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'solid'],
  rules: {
    // General rules
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // SolidJS specific rules
    'solid/reactivity': 'error',
    'solid/no-destructure': 'error',
    'solid/jsx-no-duplicate-props': 'error',
    'solid/jsx-no-script-url': 'error',
    'solid/jsx-no-undef': 'error',
    'solid/jsx-uses-vars': 'error',
    'solid/no-react-deps': 'error',
    'solid/no-react-specific-props': 'error',
    'solid/prefer-for': 'error',
    
    // Import/export rules
    'import/no-unresolved': 'off', // TypeScript handles this
    'import/extensions': 'off',
  },
  overrides: [
    {
      // Astro files
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Disable some rules that don't work well with Astro
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
      },
    },
    {
      // SolidJS component files
      files: ['*.tsx', '*.jsx'],
      rules: {
        // Allow JSX in .tsx and .jsx files
        'react/jsx-filename-extension': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      // Configuration files
      files: [
        'astro.config.*',
        'tailwind.config.*',
        'vite.config.*',
        '.eslintrc.*',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '.astro/',
    '*.d.ts',
  ],
};