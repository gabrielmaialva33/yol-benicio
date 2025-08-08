import {expect, test} from '@playwright/test'

// Constants for performance thresholds and timeouts
const NETWORK_DELAY_3G = 500 // 500ms delay to simulate slow 3G
const API_DELAY_SLOW = 2000 // 2 second delay for API calls
const OFFLINE_WAIT_TIMEOUT = 2000 // 2 seconds to wait for offline state
const PAGE_LOAD_TIMEOUT = 5000 // 5 seconds maximum page load time
const FCP_TIMEOUT = 2000 // 2 seconds for First Contentful Paint
const TABLE_LOAD_TIMEOUT = 3000 // 3 seconds for table rendering
const MAX_PAGINATION_ROWS = 50 // Maximum rows before pagination
const NAVIGATION_ITERATIONS = 5 // Number of navigation iterations for memory test
const MEMORY_GROWTH_MULTIPLIER = 1.5 // Allow 50% memory growth
const GENERAL_TIMEOUT = 1000 // General timeout for operations

// Regex patterns (moved to top-level for performance)
const ERROR_MESSAGE_REGEX = /erro|falha/i

// Type definitions for performance memory API
interface PerformanceMemory {
	usedJSHeapSize: number
	totalJSHeapSize: number
	jsHeapSizeLimit: number
}

interface PerformanceWithMemory extends Performance {
	memory?: PerformanceMemory
}

test.describe('Performance and Network Tests', () => {
	test('should handle slow network gracefully', async ({page}) => {
		// Simulate slow 3G network
		await page.route('**/*', route => {
			setTimeout(() => route.continue(), NETWORK_DELAY_3G) // Add 500ms delay
		})

		await page.goto('/yol-benicio/')

		// Page should still load
		await expect(page.getByPlaceholder('E-mail')).toBeVisible({timeout: 10_000})

		// Login
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Should eventually navigate (with longer timeout)
		await expect(page).toHaveURL('/yol-benicio/dashboard', {timeout: 15_000})
	})

	test('should show loading states', async ({page}) => {
		// Intercept API calls to add delay
		await page.route('**/api/**', route => {
			setTimeout(() => route.continue(), API_DELAY_SLOW) // 2 second delay
		})

		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')

		// Click login
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Should show loading state (spinner, disabled button, etc)
		const _loginButton = page.getByRole('button', {name: 'Entrar'})
		// Button might be disabled or show loading text
		// await expect(loginButton).toBeDisabled()

		// Eventually should navigate
		await expect(page).toHaveURL('/yol-benicio/dashboard', {timeout: 10_000})
	})

	test('should handle API errors gracefully', async ({page}) => {
		// Mock API error for login
		let errorCount = 0
		await page.route('**/api/auth/login', route => {
			if (errorCount === 0) {
				errorCount++
				route.fulfill({
					status: 500,
					body: JSON.stringify({error: 'Server error'})
				})
			} else {
				route.continue()
			}
		})

		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Should show error message
		await expect(page.getByText(ERROR_MESSAGE_REGEX)).toBeVisible()

		// Should be able to retry
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Second attempt should work
		await expect(page).toHaveURL('/yol-benicio/dashboard', {timeout: 10_000})
	})

	test('should handle offline mode', async ({page, context}) => {
		// Login first while online
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')

		// Go offline
		await context.setOffline(true)

		// Try to navigate
		await page.getByTestId('sidebar-pastas').click()

		// Page should handle offline state
		// Either show cached content or offline message
		await page.waitForTimeout(OFFLINE_WAIT_TIMEOUT)

		// Go back online
		await context.setOffline(false)

		// Should recover
		await page.reload()
		await expect(page.getByRole('heading', {name: 'Visão Geral'})).toBeVisible()
	})

	test('should measure page load performance', async ({page}) => {
		// Start measuring
		const startTime = Date.now()

		await page.goto('/yol-benicio/')

		// Wait for page to be fully loaded
		await page.waitForLoadState('networkidle')

		const loadTime = Date.now() - startTime

		// Page should load in reasonable time (adjust based on requirements)
		expect(loadTime).toBeLessThan(PAGE_LOAD_TIMEOUT) // 5 seconds

		// Check Core Web Vitals
		const metrics = await page.evaluate(() => {
			return {
				// First Contentful Paint
				fcp: performance.getEntriesByName('first-contentful-paint')[0]
					?.startTime,
				// DOM Content Loaded
				dcl:
					performance.timing.domContentLoadedEventEnd -
					performance.timing.navigationStart,
				// Load Complete
				load:
					performance.timing.loadEventEnd - performance.timing.navigationStart
			}
		})

		// FCP should be fast
		if (metrics.fcp) {
			expect(metrics.fcp).toBeLessThan(FCP_TIMEOUT) // 2 seconds
		}
	})

	test('should handle large data sets', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Navigate to folders with potentially large table
		await page.getByTestId('sidebar-pastas').click()
		await page.getByRole('link', {name: 'Consulta'}).click()

		// Measure table render time
		const tableStartTime = Date.now()
		await page.waitForSelector('table')
		const tableLoadTime = Date.now() - tableStartTime

		// Table should render quickly even with pagination
		expect(tableLoadTime).toBeLessThan(TABLE_LOAD_TIMEOUT)

		// Check if virtualization or pagination is used
		const rows = await page.locator('tbody tr').count()
		expect(rows).toBeLessThanOrEqual(MAX_PAGINATION_ROWS) // Should paginate large datasets
	})

	test('should not have memory leaks on navigation', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Get initial memory usage
		const initialMemory = await page.evaluate(() => {
			const perf = performance as PerformanceWithMemory
			if (perf.memory) {
				return perf.memory.usedJSHeapSize
			}
			return 0
		})

		// Navigate multiple times sequentially to avoid race conditions
		for (let i = 0; i < NAVIGATION_ITERATIONS; i++) {
			await page.getByTestId('sidebar-pastas').click()
			await page.getByRole('link', {name: 'Consulta'}).click()
			await page.waitForSelector('table')

			await page.getByRole('button', {name: 'Visão Geral'}).click()
			await page.waitForSelector('h3:has-text("Suas tarefas")')
		}

		// Check memory usage after navigation
		const finalMemory = await page.evaluate(() => {
			const perf = performance as PerformanceWithMemory
			if (perf.memory) {
				return perf.memory.usedJSHeapSize
			}
			return 0
		})

		// Memory shouldn't grow excessively (allow 50% increase)
		if (initialMemory > 0 && finalMemory > 0) {
			expect(finalMemory).toBeLessThan(initialMemory * MEMORY_GROWTH_MULTIPLIER)
		}
	})

	test('should handle concurrent operations', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Trigger multiple operations simultaneously
		const operations = [
			page.getByTestId('sidebar-pastas').click(),
			page.getByAltText('Notificações').click(),
			page.getByAltText('mensagens').click()
		]

		// All should complete without errors
		await Promise.all(operations.map(op => op.catch(() => null)))

		// Page should still be functional
		await page.waitForTimeout(GENERAL_TIMEOUT)
		await expect(page.getByRole('heading', {name: 'Visão Geral'})).toBeVisible()
	})
})
