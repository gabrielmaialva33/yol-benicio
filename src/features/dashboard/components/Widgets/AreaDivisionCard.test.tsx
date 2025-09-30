import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {vi} from 'vitest'
import {render, screen} from '../../../../test-utils'
import {AreaDivisionCard} from './AreaDivisionCard'

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

vi.mock('recharts', () => ({
	ResponsiveContainer: ({children}: {children: React.ReactNode}) => (
		<div data-testid='rc'>{children}</div>
	),
	PieChart: ({children}: {children: React.ReactNode}) => (
		<div data-testid='pie-chart'>{children}</div>
	),
	Pie: ({children, data}: {children: React.ReactNode; data: unknown[]}) => (
		<div data-length={data?.length} data-testid='pie'>
			{children}
		</div>
	),
	Cell: ({fill}: {fill: string}) => (
		<span data-fill={fill} data-testid='cell' />
	),
	Tooltip: () => <div data-testid='tooltip' />
}))

describe('AreaDivisionCard - Data Rendering', () => {
	it('should render title and chart structure', async () => {
		renderWithClient(<AreaDivisionCard />)

		// Title should render immediately
		expect(await screen.findByText('Divisão por áreas')).toBeInTheDocument()

		// Verify chart structure is rendered
		expect(screen.getByTestId('rc')).toBeInTheDocument()
		expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
		expect(screen.getByTestId('pie')).toBeInTheDocument()
		expect(screen.getByTestId('tooltip')).toBeInTheDocument()
	})
})
