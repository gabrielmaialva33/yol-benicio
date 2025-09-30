import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import type {FolderDetail} from '../types/folder.types'
import {FolderDetailHeader} from './FolderDetailHeader'

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
	useNavigate: () => mockNavigate
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
	ChevronLeft: () => <div data-testid='chevron-left-icon'>ChevronLeft</div>
}))

const mockFolder: FolderDetail = {
	id: '12345678',
	clientNumber: 'CN001',
	status: 'Ativo',
	date: '2024-01-15',
	time: '14:30',
	processNumber: 'PROC-2024-001',
	cnjNumber: '0000000-00.2024.0.00.0000',
	instance: 'Primeira Instância',
	nature: 'Cível',
	actionType: 'Indenização',
	phase: 'Conhecimento',
	electronic: 'Sim',
	clientCode: 'TC001',
	folder: 'FOLDER-001',
	defaultBillingCase: 'Sim',
	totus: true,
	migrated: false,
	organ: 'Tribunal de Justiça',
	distribution: 'Sorteio',
	entryDate: '2024-01-15',
	internalCode: 'INT-001',
	searchType: 'Normal',
	code: 'CODE-001',
	judge: 'Dr. João Silva',
	area: 'Cível',
	subArea: 'Contratos',
	core: 'Core 1',
	district: 'Centro',
	court: '1ª Vara Cível',
	courtDivision: 'Divisão A',
	partner: 'Dr. Partner',
	coordinator: 'Dr. Coordinator',
	lawyer: 'Dr. Lawyer',
	plaintiff: {
		name: 'João da Silva',
		cpf: '123.456.789-00',
		type: 'Autor'
	},
	defendant: {
		name: 'Empresa XYZ Ltda',
		cnpj: '00.000.000/0001-00',
		type: 'Réu'
	},
	observation: 'Observações do processo',
	objectDetail: 'Detalhes do objeto',
	lastMovement: 'Último movimento',
	caseValue: 50_000,
	distributionDate: '2024-01-15',
	responsible: {
		name: 'Dr. Responsável',
		email: 'responsavel@example.com',
		avatar: 'https://example.com/avatar.jpg',
		position: 'Advogado Sênior'
	},
	documents: [],
	movements: []
}

describe('FolderDetailHeader - Rendering', () => {
	beforeEach(() => {
		mockNavigate.mockClear()
	})

	it('should render folder ID truncated to 4 characters', () => {
		render(<FolderDetailHeader folder={mockFolder} />)

		expect(screen.getByText('Pasta #1234')).toBeInTheDocument()
	})

	it('should render status badge with correct status', () => {
		render(<FolderDetailHeader folder={mockFolder} />)

		const statusBadge = screen.getByText('Ativo')
		expect(statusBadge).toBeInTheDocument()
		expect(statusBadge).toHaveClass('bg-blue-50', 'text-blue-700')
	})

	it('should render date and time', () => {
		render(<FolderDetailHeader folder={mockFolder} />)

		// Use getAllByText and check the first one that contains the date
		const dateElements = screen.getAllByText(/2024-01-15/)
		expect(dateElements.length).toBeGreaterThan(0)

		const timeElements = screen.getAllByText(/14:30/)
		expect(timeElements.length).toBeGreaterThan(0)

		// The text is split across multiple elements, so we check for the presence of the words
		expect(screen.getByText(/Criado/)).toBeInTheDocument()
		expect(screen.getByText(/às/)).toBeInTheDocument()
	})

	it('should render back button with chevron icon', () => {
		render(<FolderDetailHeader folder={mockFolder} />)

		const backButton = screen.getByRole('button', {name: 'ChevronLeft'})
		expect(backButton).toBeInTheDocument()
		expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument()
	})

	it('should render save button', () => {
		render(<FolderDetailHeader folder={mockFolder} />)

		const saveButton = screen.getByText('Salvar')
		expect(saveButton).toBeInTheDocument()
		expect(saveButton.tagName).toBe('BUTTON')
	})

	it('should render add files button', () => {
		render(<FolderDetailHeader folder={mockFolder} />)

		const addFilesButton = screen.getByText('Adicionar arquivos')
		expect(addFilesButton).toBeInTheDocument()
		expect(addFilesButton.tagName).toBe('BUTTON')
		expect(addFilesButton).toHaveClass('bg-[#00B8D9]')
	})
})

describe('FolderDetailHeader - Status and Interactions', () => {
	beforeEach(() => {
		mockNavigate.mockClear()
	})

	it('should navigate back when back button is clicked', () => {
		render(<FolderDetailHeader folder={mockFolder} />)

		const backButton = screen.getByRole('button', {name: 'ChevronLeft'})
		fireEvent.click(backButton)

		expect(mockNavigate).toHaveBeenCalledWith(-1)
	})

	it('should render unknown status with default styling', () => {
		const folderWithUnknownStatus = {
			...mockFolder,
			status: 'Arquivado' as const
		}
		render(<FolderDetailHeader folder={folderWithUnknownStatus} />)

		const statusBadge = screen.getByText('Arquivado')
		expect(statusBadge).toHaveClass('bg-gray-50', 'text-gray-700')
	})

	it('should have correct header layout', () => {
		const {container} = render(<FolderDetailHeader folder={mockFolder} />)

		const headerContainer = container.firstChild
		expect(headerContainer).toHaveClass('rounded-2xl', 'border', 'bg-white')

		// Check the inner div that has the flex layout
		const flexContainer = container.querySelector('div.flex')
		expect(flexContainer).toHaveClass('flex', 'items-center', 'justify-between')
	})
})
