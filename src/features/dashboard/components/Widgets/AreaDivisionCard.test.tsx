import {vi} from 'vitest'
import {render, screen} from '../../../../test-utils'
import {AreaDivisionCard} from './AreaDivisionCard'

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

describe('AreaDivisionCard', () => {
	const mockData = [
		{name: 'Trabalhista', value: 60, color: '#111'},
		{name: 'Cível', value: 30, color: '#222'},
		{name: 'Amarelo', value: 9, color: '#333'},
		{name: 'Outros', value: 1, color: '#444'},
		{name: 'Extra', value: 10, color: '#555'}
	]

	beforeEach(() => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		} as unknown as Response)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('renderiza título e legenda com máximo de 4 itens', async () => {
		render(<AreaDivisionCard />)
		expect(await screen.findByText('Divisão por áreas')).toBeInTheDocument()
		// aguarda primeiro item da legenda (primeiro fetch resolvido)
		expect(await screen.findByText('Trabalhista')).toBeInTheDocument()
		const MaxItems = 4
		for (const item of mockData.slice(0, MaxItems)) {
			expect(screen.getByText(item.name)).toBeInTheDocument()
		}
		expect(screen.queryByText('Extra')).not.toBeInTheDocument()
	})
})
