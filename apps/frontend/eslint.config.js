//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  {
    ignores: ['.output/**', 'dist/**', 'public/**', 'node_modules/**', '.nitro/**'],
  },
  ...tanstackConfig,
];
