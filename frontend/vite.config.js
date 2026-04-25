import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '/', // Keep '/' if deploying at root domain
    build: {
        outDir: 'dist', // output folder
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            output: {
                manualChunks: undefined, // ensures all code is bundled properly
            },
        },
    },
})