/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    test: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        coverage: {
            provider: 'istanbul',
            reporter: ['html', 'text'],
            all: true,
        },
    },
});
