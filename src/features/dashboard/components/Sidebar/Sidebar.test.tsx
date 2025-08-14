import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {BrowserRouter} from 'react-router'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Sidebar} from './index'

const mockFavoriteClients = [
	{
		id: 1,
		name: 'Cliente A',
		folderCount: 5,
		color: 'bg-blue-500'
	},
	{
		id: 2,
		name: 'Cliente B',
		folderCount: 3,
		color: 'bg-green-500'
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

const renderWithProviders = (component: React.ReactElement) => {
	const testQueryClient = createTestQueryClient()
	return render(
		<BrowserRouter>
			<QueryClientProvider client={testQueryClient}>
				{component}
			</QueryClientProvider>
		</BrowserRouter>
	)
}

// Mock fetch globally
beforeEach(() => {
	global.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: async () => mockFavoriteClients
	})
})

afterEach(() => {
	vi.restoreAllMocks()
})

describe('Sidebar', () => {
	it('should render logo when expanded', () => {
		renderWithProviders(<Sidebar />)

		const logo = screen.getByAltText('Logo')
		expect(logo).toBeInTheDocument()
		expect(logo).toHaveClass('w-[159px]')
	})

	it('should render search input when expanded', () => {
		renderWithProviders(<Sidebar />)

		const searchInput = screen.getByPlaceholderText('Pesquisar')
		expect(searchInput).toBeInTheDocument()
	})

	it('should render navigation items', () => {
		renderWithProviders(<Sidebar />)

		expect(screen.getByText('Visão Geral')).toBeInTheDocument()
		expect(screen.getByText('Pastas')).toBeInTheDocument()
	})

	it('should toggle collapse state when button is clicked', () => {
		const {container} = renderWithProviders(<Sidebar />)

		const toggleButton = screen.getByAltText('Alternar Barra Lateral')
		const sidebar = container.querySelector('aside')

		// Initially expanded - check for responsive classes
		expect(sidebar).toHaveClass('w-[280px]')
		expect(sidebar).toHaveClass('md:w-[340px]')

		// Click to collapse
		fireEvent.click(toggleButton)
		expect(sidebar).toHaveClass('w-16')
		expect(sidebar).toHaveClass('md:w-24')
	})

	it('should not show search input when collapsed', () => {
		renderWithProviders(<Sidebar />)

		const toggleButton = screen.getByAltText('Alternar Barra Lateral')

		// Collapse sidebar
		fireEvent.click(toggleButton)

		expect(screen.queryByPlaceholderText('Pesquisar')).not.toBeInTheDocument()
	})

	it('should toggle dropdown when folder menu is clicked', () => {
		renderWithProviders(<Sidebar />)

		const foldersButton = screen.getByText('Pastas').parentElement
		expect(foldersButton).not.toBeNull()

		// Click to open dropdown
		if (foldersButton) {
			fireEvent.click(foldersButton)
		}

		// Sub items should be visible
		expect(screen.getByText('Cadastrar')).toBeInTheDocument()
		expect(screen.getByText('Consulta')).toBeInTheDocument()
	})

	it('should call API endpoint for favorite clients', async () => {
		renderWithProviders(<Sidebar />)

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/dashboard/favorite-clients'
			)
		})
	})

	it('should have correct sidebar styling', () => {
		const {container} = renderWithProviders(<Sidebar />)

		const sidebar = container.querySelector('aside')
		expect(sidebar).toHaveClass(
			'bg-[#373737]',
			'transition-all',
			'duration-300'
		)
	})
})
