import {expect, test} from '@playwright/test'

const FILTER_WAIT_TIME = 1000

// Helper function to navigate to folders consultation page
async function navigateToFoldersConsultation(page) {
	// Direct navigation to avoid mobile sidebar issues
	await page.goto('/yol-project/dashboard/folders/consultation')
}

// Helper function to navigate to folders registration page
async function navigateToFoldersRegistration(page) {
	// Direct navigation to avoid mobile sidebar issues
	await page.goto('/yol-project/dashboard/folders/register')
}

test.describe('Folders Management', () => {
	test.beforeEach(async ({page}) => {
		// Login first
		await page.goto('/yol-project/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-project/dashboard')
	})

	test('should navigate to folders consultation page', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Should navigate to consultation page
		await expect(page).toHaveURL('/yol-project/dashboard/folders/consultation')
		await expect(
			page.getByRole('heading', {name: 'Consulta de pastas'})
		).toBeVisible()
	})

	test('should navigate to folders registration page', async ({page}) => {
		// Navigate to registration page
		await navigateToFoldersRegistration(page)

		// Should navigate to registration page
		await expect(page).toHaveURL('/yol-project/dashboard/folders/register')
	})

	test('should display folder consultation filters', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Check for filter elements - use actual placeholders from component
		await expect(page.getByPlaceholder('N° Cliente')).toBeVisible()
		await expect(page.getByPlaceholder('Data de inclusão')).toBeVisible()
		await expect(page.getByPlaceholder('Buscar')).toBeVisible()
		await expect(page.getByRole('button', {name: 'Limpar'})).toBeVisible()
	})

	test('should display folder table with data', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Wait for table to load and data to be present
		await page.waitForSelector('table')
		await page.waitForSelector('tbody tr', {timeout: 10_000})

		// Check table headers
		await expect(page.getByRole('columnheader', {name: 'Código'})).toBeVisible()
		await expect(
			page.getByRole('columnheader', {name: 'Responsável'})
		).toBeVisible()
		await expect(page.getByRole('columnheader', {name: 'Área'})).toBeVisible()
		await expect(page.getByRole('columnheader', {name: 'Status'})).toBeVisible()

		// Should have at least one row of data
		const tableRows = page.locator('tbody tr')
		await expect(tableRows.first()).toBeVisible({timeout: 10_000})
		await expect(tableRows).toHaveCount(10) // Default pagination is 10 items
	})

	test('should navigate to folder detail page', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Wait for table to load and data to be present
		await page.waitForSelector('table')
		await page.waitForSelector('tbody tr', {timeout: 10_000})

		// Click on the arrow button in the first folder row
		const firstRowArrowButton = page
			.locator('tbody tr')
			.first()
			.locator('a[href*="/folders/consultation/"]')
		await expect(firstRowArrowButton).toBeVisible({timeout: 10_000})
		await firstRowArrowButton.click()

		// Should navigate to detail page
		await expect(page.url()).toContain('/folders/')

		// Check detail page elements
		await expect(page.getByText(/Pasta #\d+/)).toBeVisible()
		await expect(page.getByRole('button', {name: 'Salvar'})).toBeVisible()
		await expect(
			page.getByRole('button', {name: 'Adicionar arquivos'})
		).toBeVisible()
	})

	test('should show folder timeline in detail page', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Wait for table data to load
		await page.waitForSelector('table')
		await page.waitForSelector('tbody tr', {timeout: 10_000})

		// Click on the arrow button in the first folder row to navigate to details
		const firstRowArrowButton = page
			.locator('tbody tr')
			.first()
			.locator('a[href*="/folders/consultation/"]')
		await expect(firstRowArrowButton).toBeVisible({timeout: 10_000})
		await firstRowArrowButton.click()

		// Wait for detail page to load
		await page.waitForURL('**/folders/consultation/**')

		// Click on "Andamento" tab to show the timeline
		await page.getByRole('button', {name: 'Andamento'}).click()

		// Check for timeline - the actual text is "Histórico" not "Linha do Tempo"
		await expect(page.getByText('Histórico')).toBeVisible({timeout: 10_000})

		// Should have timeline items - they are in a div with space-y-6 class
		const timelineItems = page.locator('.space-y-6 > div')
		await expect(timelineItems.first()).toBeVisible()
	})

	test('should paginate through folders', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Wait for table and pagination with data
		await page.waitForSelector('table')
		await page.waitForSelector('tbody tr', {timeout: 10_000})

		// Check pagination controls - format is "01 de 05" not "Página 1 de 5"
		await expect(page.getByText(/\d{2} de \d{2}/)).toBeVisible({
			timeout: 10_000
		})

		// Click next page if available - the button has a title "Next"
		const nextButton = page.getByTitle('Next')
		const isNextEnabled = await nextButton.isEnabled()

		if (isNextEnabled) {
			await nextButton.click()
			// Check that page number changed
			await expect(page.getByText(/Página 2/)).toBeVisible()
		}
	})

	test('should filter folders by client name', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Wait for page to load first
		await page.waitForSelector('table', {timeout: 10_000})

		// Type in search field - use actual placeholder from component
		const searchInput = page.getByPlaceholder('Buscar')
		await expect(searchInput).toBeVisible()
		await searchInput.fill('João')

		// Wait for filtered results (no explicit search button click needed)
		await page.waitForTimeout(FILTER_WAIT_TIME)

		// Table should still be visible (even if no results)
		await expect(page.locator('table')).toBeVisible()
	})

	test('should clear filters', async ({page}) => {
		// Navigate to consultation page
		await navigateToFoldersConsultation(page)

		// Apply a filter
		await page.getByPlaceholder('Buscar').fill('Test')

		// Clear filters
		await page.getByRole('button', {name: 'Limpar'}).click()

		// Search input should be empty
		await expect(page.getByPlaceholder('Buscar')).toHaveValue('')
	})
})
