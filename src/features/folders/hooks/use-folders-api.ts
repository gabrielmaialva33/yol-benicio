import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {API_BASE_URL} from '../../../config/api'
import {useAuth} from '../../../shared/hooks/auth-context'
import {createApiHooks} from '../../../shared/hooks/use-api'
import type {
	ApiResponse,
	PaginatedResponse,
	QueryParams
} from '../../../shared/types/api'
import type {Folder} from '../../../shared/types/domain'

// Wrapper functions to provide token dynamically
export function useFoldersList(params?: QueryParams) {
	const {token} = useAuth()
	const folderApi = token
		? createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`,
				token
			})
		: createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`
			})
	return folderApi.useList(params)
}

export function useFolder(id: number | string) {
	const {token} = useAuth()
	const folderApi = token
		? createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`,
				token
			})
		: createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`
			})
	return folderApi.useGet(id)
}

export function useCreateFolder() {
	const {token} = useAuth()
	const folderApi = token
		? createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`,
				token
			})
		: createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`
			})
	return folderApi.useCreate()
}

export function useUpdateFolder() {
	const {token} = useAuth()
	const folderApi = token
		? createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`,
				token
			})
		: createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`
			})
	return folderApi.useUpdate()
}

export function useDeleteFolder() {
	const {token} = useAuth()
	const folderApi = token
		? createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`,
				token
			})
		: createApiHooks<Folder>({
				baseUrl: `${API_BASE_URL}/api/v1/folders`
			})
	return folderApi.useDelete()
}

interface FolderStats {
	active: number
	newThisMonth: number
	history: {
		month: string
		value: number
	}[]
}

// Custom hook to toggle favorite
function useToggleFolderFavorite() {
	const {token} = useAuth()
	const queryClient = useQueryClient()

	return useMutation<ApiResponse<Folder>, Error, number>({
		mutationFn: async id => {
			const response = await fetch(
				`${API_BASE_URL}/api/v1/folders/${id}/favorite`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						...(token && {Authorization: `Bearer ${token}`})
					}
				}
			)

			if (!response.ok) {
				throw new Error('Erro ao alterar favorito')
			}

			return response.json()
		},
		onSuccess: data => {
			// Update list cache
			queryClient.setQueryData<PaginatedResponse<Folder>>(
				[`${API_BASE_URL}/api/v1/folders`, 'list'],
				old => {
					if (!old) {
						return old
					}
					return {
						...old,
						data: old.data.map(folder =>
							folder.id === data.data.id ? data.data : folder
						)
					}
				}
			)

			// Atualizar cache individual
			queryClient.setQueryData<ApiResponse<Folder>>(
				[`${API_BASE_URL}/api/v1/folders`, 'get', data.data.id],
				data
			)
		}
	})
}

// Hook for statistics
function useFolderStats() {
	const {token} = useAuth()

	return useQuery({
		queryKey: ['folders', 'stats'],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/api/v1/folders/stats`, {
				headers: {
					'Content-Type': 'application/json',
					...(token && {Authorization: `Bearer ${token}`})
				}
			})

			if (!response.ok) {
				throw new Error('Erro ao buscar estatísticas')
			}

			return response.json() as Promise<ApiResponse<FolderStats>>
		}
	})
}

// Consultation hook with advanced filters
function useFolderConsultation(filters?: QueryParams) {
	const queryParams: QueryParams = {
		per_page: 10,
		page: 1,
		sort_by: 'created_at',
		order: 'desc',
		...filters
	}

	return useFoldersList(queryParams)
}

export {useToggleFolderFavorite, useFolderStats, useFolderConsultation}
