import {render, screen} from '@testing-library/react'
import {vi} from 'vitest'
import type {Task} from '../../../../shared/types/domain'
import {TaskItem} from './TaskItem'

describe('TaskItem - Rendering and Interaction', () => {
	const baseTask: Task = {
		id: 1,
		title: 'Test Task',
		status: 'pending',
		priority: 'high',
		folder: {id: 1, title: 'Test Folder', created_at: '', updated_at: ''},
		due_date: new Date().toISOString()
	} as Task

	it('should display title and red border for high priority', () => {
		const fn = vi.fn()
		const {container} = render(<TaskItem task={baseTask} toggleTask={fn} />)
		expect(screen.getByText('Test Task')).toBeInTheDocument()
		const wrapper = container.firstChild as HTMLElement
		expect(wrapper).toHaveStyle({borderColor: 'red'})
	})

	it('should trigger toggleTask when button is clicked', () => {
		const fn = vi.fn()
		render(<TaskItem task={baseTask} toggleTask={fn} />)
		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBeGreaterThan(0)
		const first = buttons[0] as HTMLButtonElement | undefined
		expect(first).toBeTruthy()
		first?.click()
		expect(fn).toHaveBeenCalledWith(1)
	})
})
