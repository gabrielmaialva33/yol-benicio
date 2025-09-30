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
	Eye: () => <div data-testid='eye-icon' />
}))

describe('ProcessTimeline - Event Rendering', () => {
	it('should render timeline header', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(screen.getByText('Histórico')).toBeInTheDocument()
	})

	it('should render all timeline events', () => {
		render(<ProcessTimeline folderId='123' />)

		// Check for event titles
		expect(
			screen.getByText('Faturamento realizado com sucesso')
		).toBeInTheDocument()
		expect(screen.getByText('Acórdão Apelação')).toBeInTheDocument()
		expect(screen.getByText('Bônus por improcedência')).toBeInTheDocument()
		expect(
			screen.getByText('2 novos arquivos vinculados ao processo')
		).toBeInTheDocument()
	})

	it('should render reference numbers', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(screen.getByText('#7979207')).toBeInTheDocument()
		expect(screen.getByText('#7966690')).toBeInTheDocument()
	})

	it('should render event categories', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(screen.getByText('Recursal')).toBeInTheDocument()
		expect(screen.getAllByText('Interno')).toHaveLength(2) // Multiple "Interno" labels
		expect(screen.getByText('Execução Definitiva')).toBeInTheDocument()
	})

	it('should render success status with action button', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(
			screen.getByText('A pasta foi encerrada e faturada.')
		).toBeInTheDocument()
		expect(screen.getByText('Proceed')).toBeInTheDocument()
	})
})

describe('ProcessTimeline - Documents and Metadata', () => {
	const ExpectedAddedByCount = 4
	const ExpectedAvatarCount = 4

	it('should render document attachments', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(screen.getByText('Finance KPI App Guidelines')).toBeInTheDocument()
		expect(screen.getByText('Brand Book - Webpixels')).toBeInTheDocument()
		expect(screen.getByText('2.5 MB')).toBeInTheDocument()
		expect(screen.getByText('1.8 MB')).toBeInTheDocument()
	})

	it('should render visualizar buttons', () => {
		render(<ProcessTimeline folderId='123' />)

		const visualizarButtons = screen.getAllByText('Visualizar')
		expect(visualizarButtons).toHaveLength(2)
	})

	it('should render timeline icons based on event type', () => {
		render(<ProcessTimeline folderId='123' />)

		expect(screen.getByTestId('edit-icon')).toBeInTheDocument()
		expect(screen.getAllByTestId('message-square-icon')).toHaveLength(2)
		expect(screen.getByTestId('link-off-icon')).toBeInTheDocument()
	})

	it('should render added by information with dates', () => {
		render(<ProcessTimeline folderId='123' />)

		const addedByTexts = screen.getAllByText(/Adicionado 29\/11\/2024 por/)
		expect(addedByTexts).toHaveLength(ExpectedAddedByCount)
	})

	it('should render user avatars', () => {
		render(<ProcessTimeline folderId='123' />)

		const avatars = screen.getAllByRole('img')
		expect(avatars).toHaveLength(ExpectedAvatarCount)
		expect(avatars[0]).toHaveAttribute('alt', 'Ana Silva')
	})
})
