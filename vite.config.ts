/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    test: {
        globals: true,
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        coverage: {
            provider: 'istanbul',
            reporter: ['html', 'text'],
        },
    },
});
