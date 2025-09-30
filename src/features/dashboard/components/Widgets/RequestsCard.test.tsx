import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import {vi} from 'vitest'
import {RequestsCard} from './RequestsCard'

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
	AreaChart: ({children}: {children: React.ReactNode}) => (
		<div data-testid='area-chart'>{children}</div>
	),
	Area: () => <div data-testid='area' />,
	CartesianGrid: () => null,
	XAxis: () => null,
	YAxis: () => null,
	Tooltip: () => null
}))

describe('RequestsCard - Data Rendering and Navigation', () => {
	it('should render title and fetch requests data from API', async () => {
		renderWithClient(<RequestsCard />)

		// Title should render immediately
		expect(await screen.findByText('Requisições')).toBeInTheDocument()
		expect(screen.getByText('Requisições por período')).toBeInTheDocument()

		// Wait for chart to have data loaded
		await waitFor(
			() => {
				const areaChart = screen.getByTestId('area-chart')
				expect(areaChart).toBeInTheDocument()
			},
			{timeout: 3000}
		)

		// Verify navigation buttons are present
		expect(screen.getByLabelText('Mês anterior')).toBeInTheDocument()
		expect(screen.getByLabelText('Próximo mês')).toBeInTheDocument()

		// Verify chart components are rendered
		expect(screen.getByTestId('area')).toBeInTheDocument()
	})

	it('should display chart with gradient and correct structure', async () => {
		renderWithClient(<RequestsCard />)

		// Wait for component to load
		await screen.findByText('Requisições')

		// Wait for chart elements
		await waitFor(
			() => {
				const areaChart = screen.getByTestId('area-chart')
				expect(areaChart).toBeInTheDocument()

				// Check if linearGradient is in the DOM (despite the warning)
				const gradientElements = areaChart.querySelectorAll(
					'linearGradient, lineargradient'
				)
				expect(gradientElements.length).toBeGreaterThan(0)
			},
			{timeout: 3000}
		)

		// Verify ResponsiveContainer wrapper
		expect(screen.getByTestId('rc')).toBeInTheDocument()
	})
})
