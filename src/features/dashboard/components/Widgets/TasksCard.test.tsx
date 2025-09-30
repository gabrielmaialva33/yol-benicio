import {fireEvent, render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useTasks} from '../../../../shared/hooks/use-tasks'
import type {Task} from '../../../../shared/types/domain'
import {TasksCard} from './TasksCard'

// Mock hooks
vi.mock('../../../../shared/hooks/use-tasks', () => ({
	useTasks: vi.fn()
}))

// Mock components
interface DateRange {
	from?: Date
	to?: Date
}

vi.mock('../../../../shared/ui/DateRangePicker', () => ({
	DateRangePicker: ({
		dateRange,
		isOpen,
		onToggle
	}: {
		dateRange: DateRange | null
		isOpen: boolean
		onToggle: () => void
	}) => (
		<div data-testid='date-range-picker'>
			<button onClick={onToggle} type='button'>
				Toggle Date Picker
			</button>
			{isOpen && <div>Date Picker Open</div>}
			{dateRange && <div>Date Range Selected</div>}
		</div>
	)
}))

vi.mock('./TaskItem', () => ({
	TaskItem: ({
		task,
		toggleTask
	}: {
		task: {id: string | number; title: string}
		toggleTask: (id: string | number) => void
	}) => (
		<div data-testid={`task-${task.id}`}>
			<span>{task.title}</span>
			<button onClick={() => toggleTask(task.id)} type='button'>
				Toggle
			</button>
		</div>
	)
}))

describe('TasksCard', () => {
	const TASK_IDS = {
		FIRST: 1,
		SECOND: 2,
		THIRD: 3
	}

	const createMockTask = (id: number, title: string): Task => ({
		id,
		title,
		description: 'Test description',
		due_date: '2024-12-31',
		status: 'pending',
		priority: 'medium',
		assigned_to: {
			id: 1,
			full_name: 'Test User',
			email: 'test@example.com',
			username: 'testuser',
			metadata: {
				email_verified: true,
				email_verified_at: '2024-01-01'
			},
			roles: [],
			created_at: '2024-01-01',
			updated_at: '2024-01-01'
		},
		created_by: {
			id: 1,
			full_name: 'Test User',
			email: 'test@example.com',
			username: 'testuser',
			metadata: {
				email_verified: true,
				email_verified_at: '2024-01-01'
			},
			roles: [],
			created_at: '2024-01-01',
			updated_at: '2024-01-01'
		},
		metadata: {},
		created_at: '2024-01-01',
		updated_at: '2024-01-01'
	})

	const mockTasks = [
		createMockTask(TASK_IDS.FIRST, 'Task 1'),
		createMockTask(TASK_IDS.SECOND, 'Task 2'),
		createMockTask(TASK_IDS.THIRD, 'Task 3')
	]

	const mockUseTasks = {
		displayTasks: mockTasks,
		dateRange: undefined,
		setDateRange: vi.fn(),
		toggleTask: vi.fn()
	}

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useTasks).mockReturnValue(mockUseTasks)
	})

	it('should render card with title', () => {
		render(<TasksCard />)

		expect(screen.getByText('Suas tarefas')).toBeInTheDocument()
	})

	it('should render all tasks', () => {
		render(<TasksCard />)

		for (const task of mockTasks) {
			expect(screen.getByTestId(`task-${task.id}`)).toBeInTheDocument()
			expect(screen.getByText(task.title)).toBeInTheDocument()
		}
	})

	it('should render date range picker', () => {
		render(<TasksCard />)

		expect(screen.getByTestId('date-range-picker')).toBeInTheDocument()
	})

	it('should toggle date picker when clicking toggle button', () => {
		render(<TasksCard />)

		const toggleButton = screen.getByText('Toggle Date Picker')

		// Initially closed
		expect(screen.queryByText('Date Picker Open')).not.toBeInTheDocument()

		// Click to open
		fireEvent.click(toggleButton)
		expect(screen.getByText('Date Picker Open')).toBeInTheDocument()

		// Click to close
		fireEvent.click(toggleButton)
		expect(screen.queryByText('Date Picker Open')).not.toBeInTheDocument()
	})

	it('should call toggleTask when clicking task toggle button', () => {
		render(<TasksCard />)

		const toggleButtons = screen.getAllByText('Toggle')
		expect(toggleButtons.length).toBeGreaterThanOrEqual(2)

		if (toggleButtons[0]) {
			fireEvent.click(toggleButtons[0])
		}
		expect(mockUseTasks.toggleTask).toHaveBeenCalledWith(TASK_IDS.FIRST)

		if (toggleButtons[1]) {
			fireEvent.click(toggleButtons[1])
		}
		expect(mockUseTasks.toggleTask).toHaveBeenCalledWith(TASK_IDS.SECOND)
	})

	it('should pass dateRange to DateRangePicker', () => {
		const dateRange = {from: new Date(), to: new Date()}
		vi.mocked(useTasks).mockReturnValue({
			...mockUseTasks,
			dateRange
		})

		render(<TasksCard />)

		expect(screen.getByText('Date Range Selected')).toBeInTheDocument()
	})

	it('should have correct card styling', () => {
		const {container} = render(<TasksCard />)

		const card = container.firstChild
		expect(card).not.toBeNull()
		if (card) {
			expect(card).toHaveClass(
				'bg-white',
				'rounded-lg',
				'p-6',
				'shadow-sm',
				'border',
				'border-gray-200',
				'relative'
			)
		}
	})

	it('should have correct header layout', () => {
		render(<TasksCard />)

		const header = screen.getByText('Suas tarefas').parentElement
		expect(header).not.toBeNull()
		if (header) {
			expect(header).toHaveClass(
				'flex',
				'items-center',
				'justify-between',
				'mb-4'
			)
		}
	})

	it('should render tasks in a spaced container', () => {
		render(<TasksCard />)

		const tasksContainer = screen.getByTestId('task-1').parentElement
		expect(tasksContainer).not.toBeNull()
		if (tasksContainer) {
			expect(tasksContainer).toHaveClass('space-y-3')
		}
	})
})
