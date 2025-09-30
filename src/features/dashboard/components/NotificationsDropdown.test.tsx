import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {NotificationsDropdown} from './NotificationsDropdown'

// Mock luxon DateTime
vi.mock('luxon', () => ({
	DateTime: {
		fromJSDate: () => ({
			toRelative: () => 'há 1 hora'
		})
	}
}))

// Mock notifications data
vi.mock('../../../mocks/data/notifications', () => ({
	notifications: {
		unread: 5,
		items: [
			{
				id: '1',
				avatar: 'https://example.com/avatar1.jpg',
				title: 'Nova mensagem recebida',
				time: new Date()
			},
			{
				id: '2',
				avatar: 'https://example.com/avatar2.jpg',
				title: 'Documento aprovado',
				time: new Date()
			},
			{
				id: '3',
				avatar: 'https://example.com/avatar3.jpg',
				title: 'Prazo se aproximando',
				time: new Date()
			}
		]
	}
}))

describe('NotificationsDropdown - Content Rendering', () => {
	it('should render notifications dropdown with title', () => {
		render(<NotificationsDropdown />)

		expect(screen.getByText('Notificações')).toBeInTheDocument()
	})

	it('should render all notification items', () => {
		render(<NotificationsDropdown />)

		expect(screen.getByText('Nova mensagem recebida')).toBeInTheDocument()
		expect(screen.getByText('Documento aprovado')).toBeInTheDocument()
		expect(screen.getByText('Prazo se aproximando')).toBeInTheDocument()
	})

	it('should render view all notifications button', () => {
		render(<NotificationsDropdown />)

		const button = screen.getByText('Ver todas as notificações')
		expect(button).toBeInTheDocument()
		expect(button.tagName).toBe('BUTTON')
	})
})

describe('NotificationsDropdown - Avatars and Time', () => {
	const ExpectedNotificationCount = 3

	it('should render avatars for each notification', () => {
		render(<NotificationsDropdown />)

		const avatars = screen.getAllByAltText('Avatar')
		expect(avatars).toHaveLength(ExpectedNotificationCount)
		expect(avatars[0]).toHaveAttribute('src', 'https://example.com/avatar1.jpg')
		expect(avatars[1]).toHaveAttribute('src', 'https://example.com/avatar2.jpg')
		expect(avatars[2]).toHaveAttribute('src', 'https://example.com/avatar3.jpg')
	})

	it('should render relative time for notifications', () => {
		render(<NotificationsDropdown />)

		const relativeTimes = screen.getAllByText('há 1 hora')
		expect(relativeTimes).toHaveLength(ExpectedNotificationCount)
	})
})

describe('NotificationsDropdown - Styling and Structure', () => {
	it('should have correct dropdown styling', () => {
		const {container} = render(<NotificationsDropdown />)

		const dropdown = container.firstChild
		expect(dropdown).toHaveClass(
			'absolute',
			'top-12',
			'right-0',
			'w-80',
			'bg-gray-50'
		)
	})

	it('should have proper structure with header and divider', () => {
		render(<NotificationsDropdown />)

		// Check for header section
		const header = screen.getByText('Notificações').parentElement
		expect(header).toHaveClass('p-4', 'border-b')

		// Check for footer section with button
		const footer = screen.getByText('Ver todas as notificações').parentElement
		expect(footer).toHaveClass('p-2', 'text-center', 'border-t')
	})
})
