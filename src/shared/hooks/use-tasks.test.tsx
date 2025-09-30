import {render, screen} from '../../test-utils'
import {useTasks} from './use-tasks'

function _useTasksHarness() {
	const {displayTasks} = useTasks()
	return displayTasks
}

describe('useTasks - Hook Functionality', () => {
	it('should return displayTasks from the hook', () => {
		const TestComponent = () => {
			const {displayTasks} = useTasks()
			// The hook should return an array
			return <div data-testid='tasks-count'>{displayTasks.length}</div>
		}

		render(<TestComponent />)

		// The component should render with tasks count
		expect(screen.getByTestId('tasks-count')).toBeInTheDocument()
	})
})
