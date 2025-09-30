import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {DashboardContent} from './DashboardContent'

// Mock all widget components
vi.mock('./Widgets/ActiveFoldersCard', () => ({
	ActiveFoldersCard: () => (
		<div data-testid='active-folders-card'>Active Folders Card</div>
	)
}))

vi.mock('./Widgets/AreaDivisionCard', () => ({
	AreaDivisionCard: () => (
		<div data-testid='area-division-card'>Area Division Card</div>
	)
}))

vi.mock('./Widgets/FolderActivityCard', () => ({
	FolderActivityCard: () => (
		<div data-testid='folder-activity-card'>Folder Activity Card</div>
	)
}))

vi.mock('./Widgets/TasksCard', () => ({
	TasksCard: () => <div data-testid='tasks-card'>Tasks Card</div>
}))

vi.mock('./Widgets/RequestsCard', () => ({
	RequestsCard: () => <div data-testid='requests-card'>Requests Card</div>
}))

vi.mock('./Widgets/HearingsCard', () => ({
	HearingsCard: () => <div data-testid='hearings-card'>Hearings Card</div>
}))

vi.mock('./Widgets/BillingCard', () => ({
	BillingCard: () => <div data-testid='billing-card'>Billing Card</div>
}))

vi.mock('./Widgets/BirthdaysCard', () => ({
	BirthdaysCard: () => <div data-testid='birthdays-card'>Birthdays Card</div>
}))

describe('DashboardContent - Widget Rendering', () => {
	it('should render all dashboard Widgets', () => {
		render(<DashboardContent />)

		// First row Widgets
		expect(screen.getByTestId('active-folders-card')).toBeInTheDocument()
		expect(screen.getByTestId('area-division-card')).toBeInTheDocument()
		expect(screen.getByTestId('folder-activity-card')).toBeInTheDocument()

		// Second row Widgets
		expect(screen.getByTestId('tasks-card')).toBeInTheDocument()
		expect(screen.getByTestId('requests-card')).toBeInTheDocument()

		// Third row Widgets
		expect(screen.getByTestId('hearings-card')).toBeInTheDocument()
		expect(screen.getByTestId('billing-card')).toBeInTheDocument()
		expect(screen.getByTestId('birthdays-card')).toBeInTheDocument()
	})
})

describe('DashboardContent - Layout Structure', () => {
	const EXPECTED_GRID_SECTIONS = 3

	it('should have correct grid layout structure', () => {
		const {container} = render(<DashboardContent />)

		const mainContainer = container.firstChild
		expect(mainContainer).toHaveClass('p-6')

		// Check for three grid sections
		const grids = container.querySelectorAll('.grid')
		expect(grids).toHaveLength(EXPECTED_GRID_SECTIONS)

		// First grid - 3 columns on large screens
		expect(grids[0]).toHaveClass(
			'grid-cols-1',
			'lg:grid-cols-3',
			'gap-6',
			'mb-6'
		)

		// Second grid - 2 columns on large screens
		expect(grids[1]).toHaveClass(
			'grid-cols-1',
			'lg:grid-cols-2',
			'gap-6',
			'mb-6'
		)

		// Third grid - 3 columns with special layout
		expect(grids[2]).toHaveClass('grid-cols-1', 'lg:grid-cols-3', 'gap-6')
	})
})

describe('DashboardContent - Component Positioning', () => {
	it('should render hearings card with 2-column span', () => {
		const {container} = render(<DashboardContent />)

		const hearingsContainer = container.querySelector('.lg\\:col-span-2')
		expect(hearingsContainer).toBeInTheDocument()
		expect(hearingsContainer).toContainElement(
			screen.getByTestId('hearings-card')
		)
	})

	it('should render billing and birthdays cards in a flex column', () => {
		const {container} = render(<DashboardContent />)

		const flexColumn = container.querySelector('.flex.flex-col.gap-6')
		expect(flexColumn).toBeInTheDocument()
		expect(flexColumn).toContainElement(screen.getByTestId('billing-card'))
		expect(flexColumn).toContainElement(screen.getByTestId('birthdays-card'))
	})
})
