import { defineConfig } from 'vitest/config';

const ONE_SECOND = 1_000;

export default defineConfig({
  test: {
    testTimeout: 60 * ONE_SECOND,
    hookTimeout: 150 * ONE_SECOND,
    exclude: ['fixtures/**/*'],
  },
});
