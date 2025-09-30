import {useQuery} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {ActiveFoldersCard} from './ActiveFoldersCard'

// Mock tanstack query
vi.mock('@tanstack/react-query', () => ({
	useQuery: vi.fn()
}))

// Mock recharts
vi.mock('recharts', () => ({
	CartesianGrid: () => <div data-testid='cartesian-grid' />,
	Line: () => <div data-testid='line' />,
	LineChart: ({children, data}: {children: React.ReactNode; data: unknown}) => (
		<div data-history={JSON.stringify(data)} data-testid='line-chart'>
			{children}
		</div>
	),
	ResponsiveContainer: ({children}: {children: React.ReactNode}) => (
		<div data-testid='responsive-container'>{children}</div>
	)
}))

// Module-level mock data
const MOCK_ACTIVE_FOLDERS_DATA = {
	active: 42,
	newThisMonth: 5,
	history: [
		{month: 'Jan', value: 30},
		{month: 'Feb', value: 35},
		{month: 'Mar', value: 42}
	]
}

describe('ActiveFoldersCard - Data Rendering', () => {
	it('should render with initial data when no data is provided', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		expect(screen.getByText('Pastas ativas')).toBeInTheDocument()
		// When data is undefined, nothing is rendered for the number
		const numberDiv = screen
			.getByText('Pastas ativas')
			.parentElement?.querySelector('.text-5xl')
		expect(numberDiv).toBeInTheDocument()
		expect(numberDiv?.textContent).toBe('')
		expect(screen.getByText(/novos neste mês/)).toBeInTheDocument()
	})

	it('should render zeros when data has zero values', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: {
				active: 0,
				newThisMonth: 0,
				history: []
			},
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		expect(screen.getByText('Pastas ativas')).toBeInTheDocument()
		expect(screen.getByText('0')).toBeInTheDocument()
		expect(screen.getByText('0 novos neste mês')).toBeInTheDocument()
	})

	it('should render with fetched data', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: MOCK_ACTIVE_FOLDERS_DATA,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		expect(screen.getByText('Pastas ativas')).toBeInTheDocument()
		expect(screen.getByText('42')).toBeInTheDocument()
		expect(screen.getByText('5 novos neste mês')).toBeInTheDocument()
	})
})

describe('ActiveFoldersCard - UI Components', () => {
	it('should render visualizar pastas button', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: MOCK_ACTIVE_FOLDERS_DATA,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		const button = screen.getByText('Visualizar pastas')
		expect(button).toBeInTheDocument()
		expect(button).toHaveClass(
			'text-sm',
			'font-medium',
			'text-[#1CD6F4]',
			'underline'
		)
	})

	it('should render chart components', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: MOCK_ACTIVE_FOLDERS_DATA,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
		expect(screen.getByTestId('line-chart')).toBeInTheDocument()
		expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
		expect(screen.getByTestId('line')).toBeInTheDocument()
	})

	it('should pass correct data to chart', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: MOCK_ACTIVE_FOLDERS_DATA,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		const lineChart = screen.getByTestId('line-chart')
		const chartData = JSON.parse(lineChart.getAttribute('data-history') || '[]')

		expect(chartData).toEqual(MOCK_ACTIVE_FOLDERS_DATA.history)
	})
})

describe('ActiveFoldersCard - Configuration and Styling', () => {
	it('should use correct query key and function', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: MOCK_ACTIVE_FOLDERS_DATA,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		expect(useQuery).toHaveBeenCalledWith({
			queryKey: ['active-folders-stats'],
			queryFn: expect.any(Function),
			initialData: {
				active: 0,
				newThisMonth: 0,
				history: []
			}
		})
	})

	it('should have correct card styling', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: MOCK_ACTIVE_FOLDERS_DATA,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		const {container} = render(<ActiveFoldersCard />)

		const card = container.firstChild
		expect(card).toHaveClass(
			'bg-white',
			'rounded-lg',
			'p-6',
			'shadow-sm',
			'border',
			'border-gray-200',
			'flex',
			'flex-col',
			'justify-between'
		)
	})

	it('should display large number with correct styling', () => {
		vi.mocked(useQuery).mockReturnValue({
			data: MOCK_ACTIVE_FOLDERS_DATA,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useQuery>)

		render(<ActiveFoldersCard />)

		const activeNumber = screen.getByText('42')
		expect(activeNumber).toHaveClass('text-5xl', 'font-bold', 'text-[#1F2A37]')
	})
})
