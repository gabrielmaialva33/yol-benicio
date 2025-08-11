/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	base: '/yol-benicio/',
	plugins: [tsconfigPaths(), react(), tailwindcss()],
	css: {
		postcss: {
			plugins: [autoprefixer()]
		}
	},
	test: {
		bail: 1,
		clearMocks: true,
		coverage: {
			provider: 'v8',
			enabled: true,
			exclude: ['src/main.tsx', 'src/mocks/browser.ts'],
			include: ['src/**/*'],
			reporter: ['text', 'lcov'],
			reportsDirectory: 'coverage',
			thresholds: {
				lines: 10,
				functions: 15,
				branches: 25,
				statements: 10
			}
		},
		css: false,
		environment: 'happy-dom',
		globals: true,
		include: ['src/**/*.test.ts?(x)'],
		setupFiles: 'src/test-setup.ts'
	}
})
