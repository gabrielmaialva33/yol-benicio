import {render, screen} from '@testing-library/react'
import {vi} from 'vitest'
import type {Task} from '../../../../shared/types/domain'
import {TaskItem} from './TaskItem'

describe('TaskItem', () => {
	const baseTask: Task = {
		id: 1,
		title: 'Teste',
		status: 'pending',
		priority: 'high',
		folder: {id: 1, title: 'Pasta', created_at: '', updated_at: ''},
		due_date: new Date().toISOString()
	} as Task

	it('mostra título e borda vermelha para prioridade alta', () => {
		const fn = vi.fn()
		const {container} = render(<TaskItem task={baseTask} toggleTask={fn} />)
		expect(screen.getByText('Teste')).toBeInTheDocument()
		const wrapper = container.firstChild as HTMLElement
		expect(wrapper).toHaveStyle({borderColor: 'red'})
	})

	it('aciona toggleTask ao clicar no botão', () => {
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
