//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  {
    ignores: [
      '.output/**',
      'dist/**',
      'public/**',
      'node_modules/**',
      '.nitro/**',
      // Config files (not in tsconfig)
      '*.config.js',
      '*.config.ts',
      // Scripts (not in tsconfig)
      'scripts/**/*.js',
    ],
  },
  ...tanstackConfig,
];
