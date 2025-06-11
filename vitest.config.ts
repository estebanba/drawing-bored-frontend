import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest config for React + TypeScript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Simulate browser environment
    globals: true, // Use global test functions (describe, it, expect)
    setupFiles: './src/setupTests.ts', // Setup file for Testing Library
  },
}); 