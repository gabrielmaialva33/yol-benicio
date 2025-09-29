import {vi} from 'vitest'
import {fireEvent, render, screen} from '../../../../test-utils'
import {RequestsCard} from './RequestsCard'

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

describe('RequestsCard', () => {
	const mockData = [
		{month: 'Jan', value: 12, new: 5, percentage: 25},
		{month: 'Fev', value: 15, new: 3, percentage: 20},
		{month: 'Mar', value: 20, new: 8, percentage: 40}
	]

	beforeEach(() => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		} as unknown as Response)
	})

	afterEach(() => vi.restoreAllMocks())

	it('mostra dados do último mês e navega entre meses', async () => {
		render(<RequestsCard />)
		expect(await screen.findByText('Novas neste mês')).toBeInTheDocument()
		expect(screen.getByText('8')).toBeInTheDocument()
		fireEvent.click(screen.getByLabelText('Mês anterior'))
		expect(await screen.findByText('Novas em Fev')).toBeInTheDocument()
		fireEvent.click(screen.getByLabelText('Mês anterior'))
		expect(await screen.findByText('Novas em Jan')).toBeInTheDocument()
	})
})
