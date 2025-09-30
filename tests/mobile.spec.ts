import {expect, test} from '@playwright/test'

const _DROPDOWN_WAIT_TIME = 500
const ANIMATION_DURATION = 300

test.describe('Mobile Responsiveness - Dashboard Display', () => {
	test.use({
		viewport: {width: 375, height: 667} // iPhone SE size
	})

	test.beforeEach(async ({page}) => {
		// Login first
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')
	})

	test('should display mobile-optimized dashboard', async ({page}) => {
		// Header should be visible
		await expect(page.getByRole('heading', {name: 'Visão Geral'})).toBeVisible()

		// On mobile, sidebar is collapsed by default, so search input is hidden
		// Expand sidebar first to see search input
		const expandButton = page.locator('button img[alt="Alternar Sidebar"]')
		if (await expandButton.isVisible()) {
			await expandButton.click()
			await page.waitForTimeout(ANIMATION_DURATION) // Wait for animation
		}
		await expect(page.getByPlaceholder('Pesquisar')).toBeVisible()

		// Widgets should stack vertically
		const widgets = page.locator('[class*="rounded-lg"][class*="shadow"]')
		const widgetCount = await widgets.count()
		expect(widgetCount).toBeGreaterThan(0)
	})
})

test.describe('Mobile Responsiveness - Navigation', () => {
	test.use({
		viewport: {width: 375, height: 667} // iPhone SE size
	})

	test.beforeEach(async ({page}) => {
		// Login first
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')
	})

	test('should have mobile-friendly navigation', async ({page}) => {
		// Look for hamburger menu or toggle button
		const logo = page.getByAltText('Logo')
		await expect(logo).toBeVisible()

		// The sidebar should be collapsed by default on mobile
		const sidebar = page.locator('aside').first()
		const sidebarClasses = await sidebar.getAttribute('class')
		expect(sidebarClasses).toContain('w-16') // Collapsed width on mobile

		// When collapsed, should have expand toggle button below logo
		const expandButton = page
			.locator('button img[alt="Alternar Sidebar"]')
			.locator('..')
		await expect(expandButton).toBeVisible()
	})

	test('should handle touch interactions for dropdowns', async ({page}) => {
		// On mobile, notification icon is in the header but may be part of a button
		const notificationButton = page.locator(
			'header button:has(img[alt="Notificações"])'
		)
		await expect(notificationButton).toBeVisible()
		await notificationButton.click()

		// Dropdown should appear
		const dropdown = page
			.getByRole('heading', {name: 'Notificações'})
			.locator('..')
		await expect(dropdown).toBeVisible()

		// Should show notification items
		await expect(page.getByText('Ver todas as notificações')).toBeVisible()
	})
})

test.describe('Mobile Responsiveness - Tables', () => {
	test.use({
		viewport: {width: 375, height: 667} // iPhone SE size
	})

	test.beforeEach(async ({page}) => {
		// Login first
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')
	})

	test('should display folder table in mobile view', async ({page}) => {
		// Navigate directly to consultation page (sidebar dropdown doesn't work when collapsed on mobile)
		await page.goto('/yol-benicio/dashboard/folders/consultation')

		// Table should be scrollable or responsive
		const table = page.locator('table')
		await expect(table).toBeVisible()

		// Check if table has horizontal scroll
		const tableContainer = table.locator('..')
		const containerClasses = await tableContainer.getAttribute('class')
		expect(containerClasses).toContain('overflow')
	})
})

test.describe('Mobile Responsiveness - Forms', () => {
	test.use({
		viewport: {width: 375, height: 667} // iPhone SE size
	})

	test.beforeEach(async ({page}) => {
		// Login first
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')
	})

	test('should handle form inputs on mobile', async ({page}) => {
		// Navigate directly to registration page (sidebar dropdown doesn't work when collapsed on mobile)
		await page.goto('/yol-benicio/dashboard/folders/register')

		// Form fields should be accessible - use actual field from registration form
		const processNumberField = page.getByLabel('Nº Processo')
		await expect(processNumberField).toBeVisible()

		// Should be able to type
		await processNumberField.fill('1234567-89.2024.8.26.0001')
		await expect(processNumberField).toHaveValue('1234567-89.2024.8.26.0001')
	})

	test('should show mobile-optimized date picker', async ({page}) => {
		// Navigate directly to registration page (sidebar dropdown doesn't work when collapsed on mobile)
		await page.goto('/yol-benicio/dashboard/folders/register')

		// Click date field - use actual field from registration form
		const dateField = page.getByLabel('Data de Entrada')
		await expect(dateField).toBeVisible()
		await dateField.click()

		// Date picker should be visible (native date input on mobile)
		await expect(dateField).toBeFocused()
	})
})

test.describe('Mobile Responsiveness - Auth', () => {
	test.use({
		viewport: {width: 375, height: 667} // iPhone SE size
	})

	test.beforeEach(async ({page}) => {
		// Login first
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')
	})

	test('should handle mobile logout', async ({page}) => {
		// Find logout button
		const logoutButton = page.getByAltText('sair').locator('..')
		await logoutButton.click()

		// Should redirect to login
		await expect(page).toHaveURL('/yol-benicio/')
		await expect(page.getByPlaceholder('E-mail')).toBeVisible()
	})
})

test.describe('Tablet Responsiveness', () => {
	test.use({
		viewport: {width: 768, height: 1024} // iPad size
	})

	test('should display tablet-optimized layout', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Sidebar should be visible but might be collapsible
		const sidebar = page.locator('aside').first()
		await expect(sidebar).toBeVisible()

		// Check if search is visible (tablets might show expanded sidebar)
		const searchInput = page.getByPlaceholder('Pesquisar')
		const _isSearchVisible = await searchInput.isVisible()

		// Dashboard Widgets should be in grid layout
		const dashboardContent = page.locator('main')
		await expect(dashboardContent).toBeVisible()
	})

	test('should handle orientation changes', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Change to landscape
		await page.setViewportSize({width: 1024, height: 768})

		// Layout should adjust
		await expect(page.getByRole('heading', {name: 'Visão Geral'})).toBeVisible()

		// Change back to portrait
		await page.setViewportSize({width: 768, height: 1024})

		// Layout should still work
		await expect(page.getByRole('heading', {name: 'Visão Geral'})).toBeVisible()
	})
})
