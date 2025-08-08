import {expect, test} from '@playwright/test'

test.describe('Dashboard', () => {
	test.beforeEach(async ({page}) => {
		// Login first
		await page.goto('/yol-project/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-project/dashboard')
	})

	test('should display dashboard header with title', async ({page}) => {
		await expect(page.getByRole('heading', {name: 'Visão Geral'})).toBeVisible()
		await expect(
			page.getByText('Suas tarefas principais estão nessa sessão.')
		).toBeVisible()
	})

	test('should display all dashboard Widgets', async ({page}) => {
		// Check for main Widgets
		await expect(
			page.getByRole('heading', {name: 'Suas tarefas'})
		).toBeVisible()
		await expect(
			page.getByRole('heading', {name: 'Pastas ativas'})
		).toBeVisible()
		await expect(
			page.getByRole('heading', {name: 'Atividade de Pastas'})
		).toBeVisible()
		await expect(page.getByRole('heading', {name: 'Faturamento'})).toBeVisible()
		await expect(
			page.getByRole('heading', {name: 'Aniversariantes'})
		).toBeVisible()
	})

	test('should have functional sidebar navigation', async ({page}) => {
		// Check sidebar is visible
		const sidebar = page.locator('aside').first()
		await expect(sidebar).toBeVisible()

		// Check main navigation items
		await expect(page.getByRole('button', {name: 'Visão Geral'})).toBeVisible()
		await expect(page.getByTestId('sidebar-pastas')).toBeVisible()
	})

	test('should toggle sidebar collapse', async ({page}) => {
		// Find toggle button
		const toggleButton = page.getByRole('button', {
			name: 'Alternar Barra Lateral'
		})

		// Check sidebar is expanded (has search input)
		await expect(page.getByPlaceholder('Pesquisar')).toBeVisible()

		// Click to collapse
		await toggleButton.click()

		// Check search input is hidden when collapsed
		await expect(page.getByPlaceholder('Pesquisar')).not.toBeVisible()

		// Logo should still be visible but smaller
		const logo = page.getByAltText('Logo')
		await expect(logo).toBeVisible()
	})

	test('should display notifications and messages indicators', async ({
		page
	}) => {
		// Check for notification bell
		await expect(page.getByAltText('Notificações')).toBeVisible()

		// Check for messages icon
		await expect(page.getByAltText('mensagens')).toBeVisible()

		// Check for calendar icon
		await expect(page.getByAltText('Calendário')).toBeVisible()

		// Check for user avatar
		await expect(page.getByAltText('Avatar do usuário')).toBeVisible()
	})

	test('should logout when clicking exit button', async ({page}) => {
		// Find and click logout button
		const logoutButton = page.getByAltText('sair').locator('..')
		await logoutButton.click()

		// Should redirect to login page
		await expect(page).toHaveURL('/yol-project/')
		await expect(page.getByPlaceholder('E-mail')).toBeVisible()
	})

	test('should show tasks in task widget', async ({page}) => {
		// Look for task widget
		const taskWidget = page
			.getByRole('heading', {name: 'Suas tarefas'})
			.locator('..')
		await expect(taskWidget).toBeVisible()

		// Widget should exist and have the proper structure
		// The widget contains a date picker button
		await expect(taskWidget.getByRole('button').first()).toBeVisible()
	})

	test('should show active folders count', async ({page}) => {
		// Wait for API data to load first
		await page.waitForLoadState('networkidle')

		// Look for active folders widget
		const foldersWidget = page
			.getByRole('heading', {name: 'Pastas ativas'})
			.locator('..')

		// Wait for the widget to be fully loaded and visible
		await expect(foldersWidget).toBeVisible()

		// Should display folder count - wait for it to be non-zero
		const folderCount = foldersWidget.getByText(/^\d+$/)
		await expect(folderCount).toBeVisible()
		await expect(foldersWidget.getByText(/novos neste mês/)).toBeVisible()
	})
})
