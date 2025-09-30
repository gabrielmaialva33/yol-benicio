import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {BirthdaysCard} from './BirthdaysCard'

// Mock auth token
vi.mock('../../../../shared/api/auth', () => ({
	getStoredToken: () => 'mock-token'
}))

const mockBirthdays = [
	{
		avatar: 'https://example.com/avatar1.jpg',
		name: 'João Silva',
		email: 'joao@example.com'
	},
	{
		avatar: 'https://example.com/avatar2.jpg',
		name: 'Maria Santos',
		email: 'maria@example.com'
	},
	{
		avatar: 'https://example.com/avatar3.jpg',
		name: 'Pedro Costa',
		email: 'pedro@example.com'
	}
]

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	})

const renderWithClient = (component: React.ReactElement) => {
	const testQueryClient = createTestQueryClient()
	return render(
		<QueryClientProvider client={testQueryClient}>
			{component}
		</QueryClientProvider>
	)
}

// Mock fetch globally
beforeEach(() => {
	global.fetch = vi.fn().mockImplementation(async () => ({
		ok: true,
		json: async () => mockBirthdays
	}))
})

afterEach(() => {
	vi.restoreAllMocks()
})

describe('BirthdaysCard - Rendering', () => {
	it('should render birthdays card with title', () => {
		renderWithClient(<BirthdaysCard />)

		expect(screen.getByText('Aniversariantes')).toBeInTheDocument()
	})

	it('should render subtitle', () => {
		renderWithClient(<BirthdaysCard />)

		expect(
			screen.getByText('Colegas que fazem aniversário este mês')
		).toBeInTheDocument()
	})

	it('should render "Ver todos" button', () => {
		renderWithClient(<BirthdaysCard />)

		const button = screen.getByText('Ver todos')
		expect(button).toBeInTheDocument()
		expect(button.tagName).toBe('BUTTON')
		expect(button).toHaveClass('text-cyan-500')
	})

	it('should have correct card styling', () => {
		const {container} = renderWithClient(<BirthdaysCard />)

		const card = container.firstChild
		expect(card).toHaveClass(
			'bg-white',
			'rounded-lg',
			'p-6',
			'shadow-sm',
			'border-gray-200'
		)
	})
})

describe('BirthdaysCard - Data Fetching', () => {
	it('should fetch and display only first 2 birthdays', async () => {
		renderWithClient(<BirthdaysCard />)

		await waitFor(
			() => {
				expect(screen.getByText('João Silva')).toBeInTheDocument()
				expect(screen.getByText('joao@example.com')).toBeInTheDocument()

				expect(screen.getByText('Maria Santos')).toBeInTheDocument()
				expect(screen.getByText('maria@example.com')).toBeInTheDocument()

				// Third birthday should not be displayed (only showing 2)
				expect(screen.queryByText('Pedro Costa')).not.toBeInTheDocument()
			},
			{timeout: 3000}
		)
	})

	it('should render avatars for each birthday', async () => {
		renderWithClient(<BirthdaysCard />)

		await waitFor(
			() => {
				const avatar1 = screen.getByAltText('João Silva')
				expect(avatar1).toHaveAttribute(
					'src',
					'https://example.com/avatar1.jpg'
				)
				expect(avatar1).toHaveClass('w-10', 'h-10', 'rounded-full')

				const avatar2 = screen.getByAltText('Maria Santos')
				expect(avatar2).toHaveAttribute(
					'src',
					'https://example.com/avatar2.jpg'
				)
			},
			{timeout: 3000}
		)
	})

	it('should render arrow buttons for each birthday', async () => {
		renderWithClient(<BirthdaysCard />)

		await waitFor(
			() => {
				const goButtons = screen.getAllByTitle('Go')
				expect(goButtons).toHaveLength(2)
			},
			{timeout: 3000}
		)
	})

	it('should call API endpoint correctly', async () => {
		renderWithClient(<BirthdaysCard />)

		await waitFor(
			() => {
				expect(global.fetch).toHaveBeenCalledWith(
					'http://localhost:3333/api/birthdays',
					expect.objectContaining({
						headers: expect.objectContaining({
							'Content-Type': 'application/json'
						})
					})
				)
			},
			{timeout: 3000}
		)
	})

	it('should handle empty birthdays list', async () => {
		global.fetch = vi.fn().mockResolvedValueOnce({
			ok: true,
			json: async () => []
		})

		renderWithClient(<BirthdaysCard />)

		await waitFor(
			() => {
				expect(screen.getByText('Aniversariantes')).toBeInTheDocument()
				expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
			},
			{timeout: 3000}
		)
	})
})
