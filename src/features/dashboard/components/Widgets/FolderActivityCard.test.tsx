import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {FolderActivityCard} from './FolderActivityCard'

const mockActivities = [
	{
		label: 'Abertas',
		value: 42,
		color: 'bg-blue-500',
		percentage: 60
	},
	{
		label: 'Em Progresso',
		value: 28,
		color: 'bg-yellow-500',
		percentage: 40
	},
	{
		label: 'Concluídas',
		value: 15,
		color: 'bg-green-500',
		percentage: 20
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
	global.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: async () => mockActivities
	})
})

afterEach(() => {
	vi.restoreAllMocks()
})

describe('FolderActivityCard - Rendering', () => {
	it('should render folder activity card with title', () => {
		renderWithClient(<FolderActivityCard />)

		expect(screen.getByText('Atividade de Pastas')).toBeInTheDocument()
	})

	it('should have correct card styling', () => {
		const {container} = renderWithClient(<FolderActivityCard />)

		const card = container.firstChild
		expect(card).toHaveClass('bg-white', 'rounded-lg', 'p-6', 'shadow-sm')
	})
})

describe('FolderActivityCard - Data Fetching', () => {
	it('should fetch and display folder activities', async () => {
		renderWithClient(<FolderActivityCard />)

		await waitFor(() => {
			expect(screen.getByText('Abertas')).toBeInTheDocument()
			expect(screen.getByText('42')).toBeInTheDocument()

			expect(screen.getByText('Em Progresso')).toBeInTheDocument()
			expect(screen.getByText('28')).toBeInTheDocument()

			expect(screen.getByText('Concluídas')).toBeInTheDocument()
			expect(screen.getByText('15')).toBeInTheDocument()
		})
	})

	it('should render progress bars with correct widths', async () => {
		renderWithClient(<FolderActivityCard />)

		await waitFor(() => {
			const progressBars = screen
				.getAllByRole('generic')
				.filter(el => el.className.includes('rounded-full') && el.style.width)

			expect(progressBars[0]).toHaveStyle({width: '60%'})
			expect(progressBars[1]).toHaveStyle({width: '40%'})
			expect(progressBars[2]).toHaveStyle({width: '20%'})
		})
	})

	it('should call API endpoint correctly', async () => {
		renderWithClient(<FolderActivityCard />)

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith('/api/folder-activity')
		})
	})

	it('should render empty state when no activities', async () => {
		global.fetch = vi.fn().mockResolvedValueOnce({
			ok: true,
			json: async () => []
		})

		renderWithClient(<FolderActivityCard />)

		await waitFor(() => {
			// Should still show title but no activity items
			expect(screen.getByText('Atividade de Pastas')).toBeInTheDocument()
			expect(screen.queryByText('Abertas')).not.toBeInTheDocument()
		})
	})
})
