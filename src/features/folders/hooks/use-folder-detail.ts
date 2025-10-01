import {useQuery} from '@tanstack/react-query'
import {DateTime} from 'luxon'
import {API_BASE_URL} from '../../../config/api'
import {useAuth} from '../../../shared/hooks/auth-context'
import type {ApiResponse} from '../../../shared/types/api'
import type {Folder} from '../../../shared/types/domain'
import type {FolderDetail} from '../types/folder.types'

// Transform Folder to FolderDetail
function transformToFolderDetail(folder: Folder): FolderDetail {
	const createdDate = DateTime.fromISO(folder.created_at)
	return {
		// Identification
		id: folder.id.toString(),
		clientNumber: folder.client.id.toString(),
		status: 'Ativo' as const,
		date: createdDate.toFormat('dd/MM/yyyy'),
		time: createdDate.toFormat('HH:mm'),

		// Process Information
		processNumber: folder.case_number || '',
		cnjNumber: folder.code,
		instance: 'Primeira Instância' as const,
		nature: 'Cível' as const,
		actionType: 'Ordinária',
		phase: 'Conhecimento' as const,
		electronic: 'Sim' as const,
		clientCode: folder.client.id.toString(),
		folder: folder.code,
		defaultBillingCase: 'Sim' as const,
		totus: false,
		migrated: false,

		// Court Information
		organ: 'TJSP',
		distribution: 'Sorteio' as const,
		entryDate: createdDate.toFormat('dd/MM/yyyy'),
		internalCode: folder.code,
		searchType: 'Padrão',
		code: folder.code,
		judge: 'Dr. João Silva',

		// Location and Responsibles
		area: 'Cível Contencioso',
		subArea: 'Contratos',
		core: 'Equipe 1',
		district: 'São Paulo',
		court: 'Foro Central Cível',
		courtDivision: '1ª Vara Cível',
		partner: 'Dr. João',
		coordinator: 'Dra. Maria',
		lawyer: folder.responsible_lawyer.full_name,

		// Parties
		plaintiff: {
			name: folder.client.name,
			cpf: folder.client.document,
			type: 'Autor' as const
		},
		defendant: {
			name: folder.opposing_party || 'Empresa XYZ',
			cnpj: '12.345.678/0001-90',
			type: 'Réu' as const
		},

		// Detailed Information
		observation: folder.description || '',
		objectDetail: folder.metadata?.last_movement || '',
		lastMovement: folder.metadata?.last_movement || '',

		// Values
		caseValue: folder.value || 0,
		convictionValue: 0,
		costs: 0,
		fees: 0,

		// Important Dates
		distributionDate: createdDate.toFormat('dd/MM/yyyy'),
		...(folder.metadata?.next_deadline && {
			nextHearing: folder.metadata.next_deadline
		}),

		// Responsible for the folder
		responsible: {
			name: folder.responsible_lawyer.full_name,
			email: folder.responsible_lawyer.email,
			...(folder.responsible_lawyer.avatar_url && {
				avatar: folder.responsible_lawyer.avatar_url
			}),
			position: 'Advogado'
		},

		// Attached Documents
		documents: [],

		// Movements
		movements: []
	}
}

async function getFolderDetail(
	folderId?: string,
	token?: string
): Promise<FolderDetail> {
	if (!folderId) {
		throw new Error('Folder ID is required')
	}

	const response = await fetch(`${API_BASE_URL}/api/v1/folders/${folderId}`, {
		headers: {
			'Content-Type': 'application/json',
			...(token && {Authorization: `Bearer ${token}`})
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch folder details')
	}

	const data: ApiResponse<Folder> = await response.json()
	return transformToFolderDetail(data.data)
}

export function useFolderDetail(folderId?: string) {
	const {token} = useAuth()

	const {
		data: folder,
		isLoading,
		isError
	} = useQuery({
		queryKey: ['folderDetail', folderId],
		queryFn: () => getFolderDetail(folderId, token),
		enabled: Boolean(folderId)
	})

	return {folder, isLoading, isError}
}
