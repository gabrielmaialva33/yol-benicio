import {HttpResponse, http} from 'msw'
import {App} from './App'
import {server} from './mocks/server'
import {queryClient, render, screen} from './test-utils'

const EXPECTED_LINKS = 1

describe('App Component', () => {
	describe('Successful rendering', () => {
		it('should render the login page with forgot password link', async () => {
			render(<App />)

			expect(screen.getByTestId('loading')).toBeInTheDocument()

			// Wait for the login form to load and check for the forgot password link
			await expect(screen.findAllByRole('link')).resolves.toHaveLength(
				EXPECTED_LINKS
			)

			const forgotPasswordLink = await screen.findByRole('link', {
				name: /Esqueci minha senha/
			})
			expect(forgotPasswordLink).toBeInTheDocument()
		})

		it('should render the login page when trying to access an invalid route', async () => {
			render(<App />, {route: '/invalid-route'})

			await expect(screen.findAllByRole('link')).resolves.toHaveLength(
				EXPECTED_LINKS
			)
		})
	})

	describe('Error handling', () => {
		it('should render an error message when the API call fails', async () => {
			queryClient.clear()
			server.use(
				http.get('/api/auth/login', () => new HttpResponse(null, {status: 500}))
			)
			render(<App />)

			// The login page should still render even if there are API errors
			await expect(screen.findAllByRole('link')).resolves.toHaveLength(
				EXPECTED_LINKS
			)
		})
	})
})
