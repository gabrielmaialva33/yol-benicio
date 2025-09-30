import {render, screen} from '@testing-library/react'
import {Outlet} from 'react-router'
import {describe, expect, it, vi} from 'vitest'
import {Dashboard} from './index'

// Mock react-router
vi.mock('react-router', () => ({
	Outlet: vi.fn(),
	useLocation: () => ({
		pathname: '/dashboard'
	})
}))

// Mock components
vi.mock('./components/Sidebar', () => ({
	Sidebar: () => <div data-testid='sidebar'>Sidebar</div>
}))

vi.mock('./components/Header', () => ({
	Header: () => <div data-testid='header'>Header</div>
}))

describe('Dashboard - Component Rendering', () => {
	it('should render dashboard layout with all components', () => {
		vi.mocked(Outlet).mockReturnValue(
			<div data-testid='outlet'>Outlet Content</div>
		)

		render(<Dashboard />)

		expect(screen.getByTestId('sidebar')).toBeInTheDocument()
		expect(screen.getByTestId('header')).toBeInTheDocument()
		expect(screen.getByTestId('outlet')).toBeInTheDocument()
	})

	it('should render Outlet component for nested routes', () => {
		const mockOutletContent = <div>Dashboard Content</div>
		vi.mocked(Outlet).mockReturnValue(mockOutletContent)

		render(<Dashboard />)

		expect(Outlet).toHaveBeenCalled()
	})
})

describe('Dashboard - Layout Structure', () => {
	it('should have correct layout structure', () => {
		vi.mocked(Outlet).mockReturnValue(
			<div data-testid='outlet'>Outlet Content</div>
		)

		const {container} = render(<Dashboard />)

		// Main container
		const mainContainer = container.firstChild
		expect(mainContainer).toHaveClass('flex', 'h-screen', 'bg-[#F1F1F2]')

		// Content area
		const contentArea = container.querySelector(
			'.flex-1.flex.flex-col.overflow-hidden'
		)
		expect(contentArea).toBeInTheDocument()

		// Main content with overflow
		const mainContent = container.querySelector('main')
		expect(mainContent).toHaveClass('flex-1', 'overflow-y-auto')
	})
})

describe('Dashboard - Sidebar Layout', () => {
	it('should have sidebar on the left side', () => {
		vi.mocked(Outlet).mockReturnValue(
			<div data-testid='outlet'>Outlet Content</div>
		)

		const {container} = render(<Dashboard />)

		const sidebar = screen.getByTestId('sidebar')
		const sidebarParent = sidebar.parentElement

		// Sidebar should be the first child of the main flex container
		expect(sidebarParent).toBe(container.firstChild)
	})
})

describe('Dashboard - Content Area', () => {
	it('should have header and outlet in content area', () => {
		vi.mocked(Outlet).mockReturnValue(
			<div data-testid='outlet'>Outlet Content</div>
		)

		render(<Dashboard />)

		const header = screen.getByTestId('header')
		const outlet = screen.getByTestId('outlet')

		// Both header and outlet should be rendered in the content area
		expect(header).toBeInTheDocument()
		expect(outlet).toBeInTheDocument()

		// Check that they are in the same content container
		const contentArea = header.parentElement?.parentElement
		expect(contentArea).toContainElement(header)
		expect(contentArea).toContainElement(outlet)
	})
})
