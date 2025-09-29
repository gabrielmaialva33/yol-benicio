import {vi} from 'vitest'
import {render, screen} from '../../../../test-utils'
import {HearingsCard} from './HearingsCard'

describe('HearingsCard', () => {
	const todayIso = new Date().toISOString()
	const mockData = [
		{
			label: 'Audiências',
			percentage: 50,
			total: 10,
			completed: 5,
			color: '#00A76F',
			date: todayIso
		},
		{
			label: 'Prazos',
			percentage: 20,
			total: 20,
			completed: 4,
			color: '#FF5630',
			date: todayIso
		}
	]

	beforeEach(() => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		} as unknown as Response)
	})

	afterEach(() => vi.restoreAllMocks())

	it('renderiza porcentagens e labels', async () => {
		render(<HearingsCard />)
		expect(await screen.findByText('Audiências e Prazos')).toBeInTheDocument()
		expect(screen.getByText('50%')).toBeInTheDocument()
		expect(screen.getByText('Audiências')).toBeInTheDocument()
		expect(screen.getByText('Prazos')).toBeInTheDocument()
	})
})
