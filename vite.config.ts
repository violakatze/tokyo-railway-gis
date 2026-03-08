import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/tokyo-railway-gis/',
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
