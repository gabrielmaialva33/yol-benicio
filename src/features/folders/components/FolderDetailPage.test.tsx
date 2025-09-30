import {fireEvent, render, screen} from '@testing-library/react'
import {useParams} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useFolderDetail} from '../hooks/use-folder-detail'
import type {FolderDetail} from '../types/folder.types'
import {FolderDetailPage} from './FolderDetailPage'

// Mock react-router
vi.mock('react-router', () => ({
	useParams: vi.fn()
}))

// Mock hooks
vi.mock('../hooks/use-folder-detail', () => ({
	useFolderDetail: vi.fn()
}))

// Mock components
vi.mock('./FolderDetailHeader', () => ({
	FolderDetailHeader: ({folder}: {folder: {id: string}}) => (
		<div data-testid='folder-detail-header'>Header for {folder.id}</div>
	)
}))

vi.mock('./FolderDetailSidebar', () => ({
	FolderDetailSidebar: ({
		activeTab,
		onTabChange
	}: {
		activeTab: string
		onTabChange: (tab: string) => void
	}) => (
		<div data-testid='folder-detail-sidebar'>
			<button onClick={() => onTabChange('processo')} type='button'>
				Processo
			</button>
			<button onClick={() => onTabChange('andamento')} type='button'>
				Andamento
			</button>
			<button onClick={() => onTabChange('informacoes')} type='button'>
				Informações Gerais
			</button>
			<button onClick={() => onTabChange('publicacoes')} type='button'>
				Publicações
			</button>
			<button onClick={() => onTabChange('agenda')} type='button'>
				Agenda
			</button>
			<div>Active: {activeTab}</div>
		</div>
	)
}))

vi.mock('./FolderProcessForm', () => ({
	FolderProcessForm: ({folder}: {folder: {id: string}}) => (
		<div data-testid='folder-detail-form'>Form for {folder.id}</div>
	)
}))

vi.mock('./ProcessTimeline', () => ({
	ProcessTimeline: ({folderId}: {folderId: string}) => (
		<div data-testid='process-timeline'>Timeline for {folderId}</div>
	)
}))

// Module-level mock folder data
const MOCK_FOLDER_DETAIL: FolderDetail = {
	id: '123',
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
	code: 'TEST-123',
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

describe('FolderDetailPage - Loading and Error States', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useParams).mockReturnValue({folderId: '123'})
	})

	it('should render loading state', () => {
		vi.mocked(useFolderDetail).mockReturnValue({
			folder: undefined,
			isLoading: true,
			isError: false
		} as ReturnType<typeof useFolderDetail>)

		render(<FolderDetailPage />)

		expect(screen.getByText('Carregando...')).toBeInTheDocument()
	})

	it('should render error state', () => {
		vi.mocked(useFolderDetail).mockReturnValue({
			folder: undefined,
			isLoading: false,
			isError: true
		} as ReturnType<typeof useFolderDetail>)

		render(<FolderDetailPage />)

		expect(
			screen.getByText('Erro ao buscar os detalhes da pasta.')
		).toBeInTheDocument()
	})

	it('should handle null folder error state', () => {
		vi.mocked(useFolderDetail).mockReturnValue({
			folder: undefined,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useFolderDetail>)

		render(<FolderDetailPage />)

		expect(
			screen.getByText('Erro ao buscar os detalhes da pasta.')
		).toBeInTheDocument()
	})
})

describe('FolderDetailPage - Initial Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useParams).mockReturnValue({folderId: '123'})
	})

	it('should render folder details with default processo tab', () => {
		vi.mocked(useFolderDetail).mockReturnValue({
			folder: MOCK_FOLDER_DETAIL,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useFolderDetail>)

		render(<FolderDetailPage />)

		expect(screen.getByTestId('folder-detail-header')).toBeInTheDocument()
		expect(screen.getByTestId('folder-detail-sidebar')).toBeInTheDocument()
		expect(screen.getByTestId('folder-detail-form')).toBeInTheDocument()
		expect(screen.getByText('Active: processo')).toBeInTheDocument()
	})

	it('should handle special folder ID 1830', () => {
		vi.mocked(useParams).mockReturnValue({folderId: '1830'})
		vi.mocked(useFolderDetail).mockReturnValue({
			folder: MOCK_FOLDER_DETAIL,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useFolderDetail>)

		render(<FolderDetailPage />)

		expect(useFolderDetail).toHaveBeenCalledWith('1830')
	})
})

describe('FolderDetailPage - Tab Navigation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useParams).mockReturnValue({folderId: '123'})
		vi.mocked(useFolderDetail).mockReturnValue({
			folder: MOCK_FOLDER_DETAIL,
			isLoading: false,
			isError: false
		} as ReturnType<typeof useFolderDetail>)
	})

	it('should switch to andamento tab and show timeline', () => {
		render(<FolderDetailPage />)

		const andamentoButton = screen.getByText('Andamento')
		fireEvent.click(andamentoButton)

		expect(screen.getByTestId('process-timeline')).toBeInTheDocument()
		expect(screen.getByText('Timeline for 123')).toBeInTheDocument()
	})

	it('should switch to informacoes tab', () => {
		render(<FolderDetailPage />)

		const infoButton = screen.getByRole('button', {name: 'Informações Gerais'})
		fireEvent.click(infoButton)

		expect(
			screen.getByRole('heading', {name: 'Informações Gerais'})
		).toBeInTheDocument()
		expect(
			screen.getByText('Conteúdo das informações gerais...')
		).toBeInTheDocument()
	})

	it('should switch to publicacoes tab', () => {
		render(<FolderDetailPage />)

		const pubButton = screen.getByText('Publicações')
		fireEvent.click(pubButton)

		expect(screen.getByText('Lista de publicações...')).toBeInTheDocument()
	})

	it('should switch to agenda tab', () => {
		render(<FolderDetailPage />)

		const agendaButton = screen.getByText('Agenda')
		fireEvent.click(agendaButton)

		expect(screen.getByText('Eventos agendados...')).toBeInTheDocument()
	})
})
