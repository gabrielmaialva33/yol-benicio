import {render, screen} from '../../../../test-utils'
import {HearingsCard} from './HearingsCard'

describe('HearingsCard - Component Rendering', () => {
	it('should render title and date picker', async () => {
		render(<HearingsCard />)

		// Title should render immediately
		expect(await screen.findByText('Audiências e Prazos')).toBeInTheDocument()

		// Verify date picker button is present
		expect(screen.getByText('Selecione um período')).toBeInTheDocument()
	})
})
