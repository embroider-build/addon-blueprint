import { defineConfig } from 'vitest/config';

const ONE_SECOND = 1_000;

export default defineConfig({
  test: {
    testTimeout: 30 * ONE_SECOND,
    hookTimeout: 100 * ONE_SECOND,
  },
});
