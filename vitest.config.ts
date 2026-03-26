import { aliasTs } from '@bemedev/vitest-alias';
import { exclude } from '@bemedev/vitest-exclude';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfig from './tsconfig.json';

export default defineConfig({
  plugins: [
    aliasTs(tsconfig as any),
    exclude({
      ignoreCoverageFiles: ['**/index.ts', './src/types.ts', '.pack/**/*'],
      ignoreTestFiles: ['.pack/**/*'],
    }),
    react(),
  ],

  test: {
    bail: 10,
    maxConcurrency: 10,
    passWithNoTests: true,
    slowTestThreshold: 3000,
    globals: true,
    logHeapUsage: true,
    environment: 'jsdom',
    coverage: {
      enabled: true,
      reportsDirectory: '.coverage',
      all: true,
      provider: 'v8',
    },
  },
});
