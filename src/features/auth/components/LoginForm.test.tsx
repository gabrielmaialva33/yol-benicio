import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {server} from 'mocks/server'
import {HttpResponse, http} from 'msw'
import {MemoryRouter} from 'react-router'
import {vi} from 'vitest'
import {AuthProvider} from '../../../shared/hooks/use-auth'
import {LoginForm} from './LoginForm'

const queryClient = new QueryClient()

const renderLoginForm = () => {
	return render(
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<MemoryRouter>
					<LoginForm />
				</MemoryRouter>
			</AuthProvider>
		</QueryClientProvider>
	)
}

describe('LoginForm', () => {
	it('should render the login form correctly', () => {
		renderLoginForm()
		expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /Entrar/i})).toBeInTheDocument()
	})

	it('should display validation errors for empty fields', async () => {
		renderLoginForm()
		fireEvent.click(screen.getByRole('button', {name: /Entrar/i}))

		expect(await screen.findByText('E-mail é obrigatório')).toBeInTheDocument()
		expect(await screen.findByText('Senha é obrigatória')).toBeInTheDocument()
	})

	it('should display a validation error for an invalid email', async () => {
		renderLoginForm()
		fireEvent.change(screen.getByPlaceholderText('E-mail'), {
			target: {value: 'invalid-email'}
		})
		fireEvent.click(screen.getByRole('button', {name: /Entrar/i}))

		expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
	})

	it('should display an error message on login failure', async () => {
		server.use(
			http.post('/api/login', () => {
				return new HttpResponse(null, {status: 401})
			})
		)

		renderLoginForm()
		fireEvent.change(screen.getByPlaceholderText('E-mail'), {
			target: {value: 'test@test.com'}
		})
		fireEvent.change(screen.getByPlaceholderText('Senha'), {
			target: {value: 'password123'}
		})
		fireEvent.click(screen.getByRole('button', {name: /Entrar/i}))

		expect(
			await screen.findByText('E-mail ou senha inválidos')
		).toBeInTheDocument()
	})

	it('should not call the API if the form is invalid', async () => {
		const loginSpy = vi.spyOn(global, 'fetch')
		renderLoginForm()
		fireEvent.click(screen.getByRole('button', {name: /Entrar/i}))

		await waitFor(() => {
			expect(loginSpy).not.toHaveBeenCalled()
		})
	})
})
