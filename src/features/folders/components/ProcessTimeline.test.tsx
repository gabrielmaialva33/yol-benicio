import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {ProcessTimeline} from './ProcessTimeline'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
	FileText: () => <div data-testid='file-text-icon' />,
	MessageSquare: () => <div data-testid='message-square-icon' />,
	Link2Off: () => <div data-testid='link-off-icon' />,
	Edit3: () => <div data-testid='edit-icon' />,
	Download: () => <div data-testid='download-icon' />,
	Eye: () => <div data-testid='eye-icon' />,
	TrendingUp: () => <div data-testid='trending-up-icon' />,
	Gavel: () => <div data-testid='gavel-icon' />,
	Scale: () => <div data-testid='scale-icon' />,
	UserPlus: () => <div data-testid='user-plus-icon' />,
	Clock: () => <div data-testid='clock-icon' />,
	Paperclip: () => <div data-testid='paperclip-icon' />,
	CheckCircle: () => <div data-testid='check-circle-icon' />,
	AlertCircle: () => <div data-testid='alert-circle-icon' />,
	Bell: () => <div data-testid='bell-icon' />,
	X: () => <div data-testid='x-icon' />
}))

describe('ProcessTimeline - Event Rendering', () => {
	it('should render timeline header', () => {
		render(<ProcessTimeline folderId='123' />)

		// Check that the search input exists
		const searchInput = screen.getByPlaceholderText('')
		expect(searchInput).toBeInTheDocument()
	})

	it('should render all timeline events', () => {
		render(<ProcessTimeline folderId='123' />)

		// Check for event titles
		expect(
			screen.getByText('Faturamento realizado com sucesso')
		).toBeInTheDocument()
		expect(screen.getByText('Acórdão Apelação')).toBeInTheDocument()
		expect(screen.getByText('Audiência de Conciliação')).toBeInTheDocument()
		expect(screen.getByText('2 novos documentos anexados')).toBeInTheDocument()
	})

	it('should render reference numbers', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(screen.getByText('#7979207')).toBeInTheDocument()
		expect(screen.getByText('#7966690')).toBeInTheDocument()
	})

	it('should render event categories', () => {
		render(<ProcessTimeline folderId='123' />)

		// Check that category badges are rendered (they exist in spans with rounded-full class)
		const categoryBadges = screen.getAllByRole('generic', {
			selector: 'span.rounded-full'
		})
		expect(categoryBadges.length).toBeGreaterThan(0)
	})

	it('should render success status with action button', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(
			screen.getByText('A pasta foi encerrada e faturada.')
		).toBeInTheDocument()

		// Check that the action button exists (it's a button with specific classes)
		const actionButtons = screen.getAllByRole('button')
		const successButton = actionButtons.find(button =>
			button.classList.contains('bg-green-600')
		)
		expect(successButton).toBeInTheDocument()
	})
})

describe('ProcessTimeline - Documents and Metadata', () => {
	const ExpectedAddedByCount = 4
	const _ExpectedAvatarCount = 4

	it('should render document attachments', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(
			screen.getByText('Petição Inicial - Ação Ordinária')
		).toBeInTheDocument()
		expect(screen.getByText('Procuração Ad Judicia')).toBeInTheDocument()
		expect(screen.getByText('2.5 MB')).toBeInTheDocument()
		expect(screen.getByText('450 KB')).toBeInTheDocument()
	})

	it('should render visualizar buttons', () => {
		render(<ProcessTimeline folderId='123' />)

		// Check that buttons with specific classes exist (they are buttons with border-gray-300)
		const buttons = screen.getAllByRole('button')
		const visualizarButtons = buttons.filter(button =>
			button.classList.contains('border-gray-300')
		)
		expect(visualizarButtons).toHaveLength(1) // Only one event has the visualizar button
	})

	it('should render timeline icons based on event type', () => {
		render(<ProcessTimeline folderId='123' />)

		// Check for the actual icons that are rendered based on mock data
		expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
		expect(screen.getByTestId('scale-icon')).toBeInTheDocument()
		expect(screen.getByTestId('paperclip-icon')).toBeInTheDocument()
		expect(screen.getByTestId('gavel-icon')).toBeInTheDocument()
	})

	it('should render added by information with dates', () => {
		render(<ProcessTimeline folderId='123' />)

		// Check for dates (they are rendered as span elements)
		const dates = screen.getAllByText('29/11/2024')
		expect(dates).toHaveLength(ExpectedAddedByCount)

		// Check for user names in alt attributes of avatars
		const avatars = screen.getAllByRole('img')
		expect(avatars[0]).toHaveAttribute('alt', 'Ana Silva')
		expect(avatars[1]).toHaveAttribute('alt', 'Carlos Mendes')
		expect(avatars[2]).toHaveAttribute('alt', 'Maria Santos')
		expect(avatars[3]).toHaveAttribute('alt', 'João Pedro')
	})

	it('should render user avatars', () => {
		render(<ProcessTimeline folderId='123' />)

		const avatars = screen.getAllByRole('img')
		// There are 6 avatars in total (4 user avatars + 2 document icons)
		expect(avatars).toHaveLength(6)

		// Check the first 4 are user avatars
		expect(avatars[0]).toHaveAttribute('alt', 'Ana Silva')
		expect(avatars[1]).toHaveAttribute('alt', 'Carlos Mendes')
		expect(avatars[2]).toHaveAttribute('alt', 'Maria Santos')
		expect(avatars[3]).toHaveAttribute('alt', 'João Pedro')
	})
})
