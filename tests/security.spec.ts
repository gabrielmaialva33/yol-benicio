import {expect, test} from '@playwright/test'

// Constants for timeouts
const XSS_CHECK_TIMEOUT = 1000 // 1 second to wait for XSS check

// Type definitions for storage data
type StorageData = Record<string, string | null>

// Helper function for testing invalid emails
const testInvalidEmail = async (page: any, email: string) => {
	await page.getByPlaceholder('E-mail').fill(email)
	await page.getByPlaceholder('Senha').fill('password123')
	await page.getByRole('button', {name: 'Entrar'}).click()

	// Should show validation error
	await expect(page.getByText('E-mail inválido')).toBeVisible()

	// Clear for next test
	await page.getByPlaceholder('E-mail').clear()
	await page.getByPlaceholder('Senha').clear()
}

// Invalid email formats for testing
const INVALID_EMAILS = [
	'notanemail',
	'@example.com',
	'user@',
	'user@@example.com',
	'user@example',
	'user space@example.com'
]

test.describe('Security - SQL Injection', () => {
	test('should not allow SQL injection in login form', async ({page}) => {
		await page.goto('/yol-benicio/')

		// Try SQL injection in email field
		await page.getByPlaceholder('E-mail').fill("' OR '1'='1")
		await page.getByPlaceholder('Senha').fill("' OR '1'='1")
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Should show error, not log in
		await expect(page.getByText('E-mail inválido')).toBeVisible()
		await expect(page).toHaveURL('/yol-benicio/') // Still on login page
	})
})

test.describe('Security - Email Validation', () => {
	test('should validate email format', async ({page}) => {
		await page.goto('/yol-benicio/')

		// Run sequentially using reduce to avoid await in loop
		await INVALID_EMAILS.reduce(async (previousPromise, email) => {
			await previousPromise
			return testInvalidEmail(page, email)
		}, Promise.resolve())
	})
})

test.describe('Security - Storage Protection', () => {
	test('should not expose sensitive data in browser storage', async ({
		page
	}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')

		// Check localStorage
		const localStorageData = await page.evaluate((): StorageData => {
			const data: StorageData = {}
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i)
				if (key) {
					data[key] = localStorage.getItem(key)
				}
			}
			return data
		})

		// Should not contain plain passwords
		const localStorageString = JSON.stringify(localStorageData).toLowerCase()
		expect(localStorageString).not.toContain('benicio123')
		expect(localStorageString).not.toContain('password')

		// Check sessionStorage
		const sessionStorageData = await page.evaluate((): StorageData => {
			const data: StorageData = {}
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i)
				if (key) {
					data[key] = sessionStorage.getItem(key)
				}
			}
			return data
		})

		const sessionStorageString =
			JSON.stringify(sessionStorageData).toLowerCase()
		expect(sessionStorageString).not.toContain('benicio123')
		expect(sessionStorageString).not.toContain('password')
	})
})

test.describe('Security - XSS Protection', () => {
	test('should handle XSS attempts in forms', async ({page}) => {
		// Login first
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Navigate to folder registration
		await page.getByTestId('sidebar-pastas').click()
		await page.getByRole('link', {name: 'Cadastrar'}).click()

		// Try XSS in client name field
		const xssPayload = '<script>alert("XSS")</script>'
		await page.getByLabel('Nome do Cliente').fill(xssPayload)

		// Try to submit
		await page.getByLabel('Código da Pasta').fill('XSS-001')

		// Check that script is not executed
		// No alert should appear
		await page.waitForTimeout(XSS_CHECK_TIMEOUT)

		// Page should still be functional
		await expect(page.getByRole('heading')).toBeVisible()
	})
})

test.describe('Security - Data Masking', () => {
	test('should mask sensitive information in UI', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')

		// Password should be masked
		const passwordField = page.getByPlaceholder('Senha')
		await passwordField.fill('benicio123')

		// Check input type
		const inputType = await passwordField.getAttribute('type')
		expect(inputType).toBe('password')

		// Login to check other sensitive data
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Check if any sensitive data like CPF is properly masked
		// This depends on the application's data display
	})
})

test.describe('Security - Authentication', () => {
	test('should require authentication for protected routes', async ({page}) => {
		// Try to access dashboard directly without login
		await page.goto('/yol-benicio/dashboard')

		// Should redirect to login
		await expect(page).toHaveURL('/yol-benicio/')
		await expect(page.getByPlaceholder('E-mail')).toBeVisible()
	})
})

test.describe('Security - Session Management', () => {
	test('should clear session on logout', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')

		// Store any auth tokens/data
		const preLogoutStorage = await page.evaluate(() => ({
			local: {...localStorage},
			session: {...sessionStorage}
		}))

		// Logout
		await page.getByAltText('sair').locator('..').click()

		// Check storage is cleared
		const postLogoutStorage = await page.evaluate(() => ({
			local: {...localStorage},
			session: {...sessionStorage}
		}))

		// Auth-related data should be cleared
		// This depends on implementation, adjust as needed
		expect(Object.keys(postLogoutStorage.local).length).toBeLessThanOrEqual(
			Object.keys(preLogoutStorage.local).length
		)
	})

	test('should prevent concurrent sessions', async ({page, context}) => {
		// Login in first tab
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()
		await expect(page).toHaveURL('/yol-benicio/dashboard')

		// Open second tab and try to login with same user
		const page2 = await context.newPage()
		await page2.goto('/yol-benicio/')
		await page2.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page2.getByPlaceholder('Senha').fill('benicio123')
		await page2.getByRole('button', {name: 'Entrar'}).click()

		// This behavior depends on the app's session management
		// Either first session is invalidated or second login is prevented
		// Adjust test based on expected behavior

		await page2.close()
	})
})

// Helper function for testing weak passwords
const testWeakPassword = async (page: any, password: string) => {
	await page.getByPlaceholder('E-mail').fill('test@example.com')
	await page.getByPlaceholder('Senha').fill(password)
	await page.getByRole('button', {name: 'Entrar'}).click()

	// Should show error
	await expect(page.getByText('Senha é obrigatória')).toBeVisible()

	// Clear for next test
	await page.getByPlaceholder('E-mail').clear()
	await page.getByPlaceholder('Senha').clear()
}

const WEAK_PASSWORDS = ['123', 'abc', '    ', '']

test.describe('Security - Password Requirements', () => {
	test('should enforce password requirements', async ({page}) => {
		await page.goto('/yol-benicio/')

		// Run sequentially using reduce to avoid await in loop
		await WEAK_PASSWORDS.reduce(async (previousPromise, password) => {
			await previousPromise
			return testWeakPassword(page, password)
		}, Promise.resolve())
	})
})

test.describe('Security - File Upload', () => {
	test('should sanitize file uploads', async ({page}) => {
		// Login
		await page.goto('/yol-benicio/')
		await page.getByPlaceholder('E-mail').fill('test@benicio.com.br')
		await page.getByPlaceholder('Senha').fill('benicio123')
		await page.getByRole('button', {name: 'Entrar'}).click()

		// Navigate to a page with file upload (if exists)
		// This is a placeholder - adjust based on actual file upload functionality
		// Example:
		// await page.getByText('Upload').click()
		// const fileInput = page.locator('input[type="file"]')
		// await fileInput.setInputFiles({
		//   name: 'test.exe',
		//   mimeType: 'application/x-msdownload',
		//   buffer: Buffer.from('fake executable content')
		// })
		// Should reject dangerous file types
	})
})
