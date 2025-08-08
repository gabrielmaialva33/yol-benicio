import {expect, test} from '@playwright/test'

test.describe('Login Flow', () => {
	test('should fill the login form and submit it successfully', async ({
		page
	}) => {
		await page.goto('/yol-benicio/')

		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')

		await page.getByRole('button', {name: 'Entrar'}).click()

		await expect(page).toHaveURL('/yol-benicio/dashboard')
	})

	test('should show an error message with invalid credentials', async ({
		page
	}) => {
		await page.goto('/yol-benicio/')

		await page.getByPlaceholder('E-mail').fill('invalid@user.com')
		await page.getByPlaceholder('Senha').fill('invalidpassword')

		await page.getByRole('button', {name: 'Entrar'}).click()

		const errorMessage = page.getByText('E-mail ou senha inválidos')
		await expect(errorMessage).toBeVisible()
	})

	test('should show validation errors for empty fields', async ({page}) => {
		await page.goto('/yol-benicio/')

		await page.getByRole('button', {name: 'Entrar'}).click()

		const emailError = page.getByText('E-mail é obrigatório')
		const passwordError = page.getByText('Senha é obrigatória')

		await expect(emailError).toBeVisible()
		await expect(passwordError).toBeVisible()
	})
})
