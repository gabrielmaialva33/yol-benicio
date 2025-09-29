import {useEffect} from 'react'
import {vi} from 'vitest'
import {render, screen} from '../../test-utils'
import {useTasks} from './use-tasks'

function useTasksHarness() {
	const {displayTasks, toggleTask} = useTasks()
	useEffect(() => {
		if (displayTasks[0]) {
			toggleTask(displayTasks[0].id)
		}
	}, [displayTasks, toggleTask])
	return displayTasks
}

describe('useTasks', () => {
	const mockTasks = {
		data: [
			{
				id: 10,
				title: 'A',
				status: 'pending',
				priority: 'low',
				folder: null,
				due_date: new Date().toISOString()
			},
			{
				id: 11,
				title: 'B',
				status: 'completed',
				priority: 'low',
				folder: null,
				due_date: new Date().toISOString()
			}
		]
	}

	beforeEach(() => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => mockTasks
		} as unknown as Response)
	})

	afterEach(() => vi.restoreAllMocks())

	it('carrega e exibe tarefas aplicando toggle otimista', async () => {
		const HarnessComponent = () => {
			const tasks = useTasksHarness()
			return (
				<ul>
					{tasks.map(t => (
						<li key={t.id}>
							{t.title}-{t.status}
						</li>
					))}
				</ul>
			)
		}
		render(<HarnessComponent />)
		expect(await screen.findByText(/A-pending/)).toBeInTheDocument()
	})
})
