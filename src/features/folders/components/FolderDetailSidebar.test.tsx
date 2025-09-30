import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {FolderDetailSidebar} from './FolderDetailSidebar'

// Mock lucide-react
vi.mock('lucide-react', () => ({
	Search: () => <div data-testid='search-icon' />
}))

// Module-level menu items
const MENU_ITEMS = [
	{name: 'Processo', id: 'processo'},
	{name: 'Andamento', id: 'andamento'},
	{name: 'Informações Gerais', id: 'informacoes'},
	{name: 'Publicações', id: 'publicacoes'},
	{name: 'Agenda', id: 'agenda'},
	{name: 'Instância', id: 'instancia'},
	{name: 'Verbas', id: 'verbas'},
	{name: 'Garantias', id: 'garantias'},
	{name: 'Desdobramento', id: 'desdobramento'},
	{name: 'Honorários', id: 'honorarios'}
]

describe('FolderDetailSidebar - Rendering', () => {
	const mockOnTabChange = vi.fn()

	it('should render search input', () => {
		render(
			<FolderDetailSidebar activeTab='processo' onTabChange={mockOnTabChange} />
		)

		expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument()
		expect(screen.getByTestId('search-icon')).toBeInTheDocument()
	})

	it('should render all menu items', () => {
		render(
			<FolderDetailSidebar activeTab='processo' onTabChange={mockOnTabChange} />
		)

		for (const item of MENU_ITEMS) {
			expect(screen.getByText(item.name)).toBeInTheDocument()
		}
	})

	it('should have correct container styling', () => {
		const {container} = render(
			<FolderDetailSidebar activeTab='processo' onTabChange={mockOnTabChange} />
		)

		const sidebar = container.firstChild
		expect(sidebar).toHaveClass(
			'w-72',
			'bg-white',
			'rounded-2xl',
			'p-6',
			'shadow-sm',
			'border'
		)
	})
})

describe('FolderDetailSidebar - Interactions', () => {
	const mockOnTabChange = vi.fn()

	it('should highlight active tab', () => {
		render(
			<FolderDetailSidebar
				activeTab='andamento'
				onTabChange={mockOnTabChange}
			/>
		)

		const andamentoButton = screen.getByText('Andamento')
		expect(andamentoButton).toHaveClass('bg-[#00B8D9]', 'text-white')

		const processoButton = screen.getByText('Processo')
		expect(processoButton).toHaveClass('text-[#161C24]', 'hover:bg-gray-50')
	})

	it('should call onTabChange when clicking menu items', () => {
		render(
			<FolderDetailSidebar activeTab='processo' onTabChange={mockOnTabChange} />
		)

		for (const item of MENU_ITEMS) {
			const button = screen.getByText(item.name)
			fireEvent.click(button)
			expect(mockOnTabChange).toHaveBeenCalledWith(item.id)
		}

		expect(mockOnTabChange).toHaveBeenCalledTimes(MENU_ITEMS.length)
	})

	it('should handle search input typing', () => {
		render(
			<FolderDetailSidebar activeTab='processo' onTabChange={mockOnTabChange} />
		)

		const searchInput = screen.getByPlaceholderText('Buscar')
		fireEvent.change(searchInput, {target: {value: 'test search'}})

		expect(searchInput).toHaveValue('test search')
	})

	it('should apply correct styling to non-active tabs', () => {
		render(
			<FolderDetailSidebar activeTab='processo' onTabChange={mockOnTabChange} />
		)

		const nonActiveButtons = MENU_ITEMS.filter(
			item => item.id !== 'processo'
		).map(item => screen.getByText(item.name))

		for (const button of nonActiveButtons) {
			expect(button).toHaveClass('text-[#161C24]', 'hover:bg-gray-50')
			expect(button).not.toHaveClass('bg-[#00B8D9]', 'text-white')
		}
	})
})
