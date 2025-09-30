import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import type {
	ApiResponse,
	ErrorResponse,
	PaginatedResponse,
	QueryParams
} from '../types/api'

interface UseApiOptions {
	baseUrl: string
	token?: string
}

export function createApiHooks<T>({baseUrl, token}: UseApiOptions) {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(token && {Authorization: `Bearer ${token}`})
	}

	// Helper function to clean base URL
	const cleanBaseUrl = (url: string) =>
		url.endsWith('/') ? url.slice(0, -1) : url

	// Helper function to clean endpoint
	const cleanEndpoint = (endpoint: string) => {
		if (!endpoint) {
			return ''
		}
		return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	}

	// Helper function to construct full URL
	const constructFullUrl = (base: string, endpoint: string) =>
		base.startsWith('http')
			? `${base}${endpoint}`
			: `${window.location.origin}${base}${endpoint}`

	// Helper function to add query parameters
	const addQueryParams = (url: URL, params: QueryParams) => {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null && value !== '') {
				url.searchParams.append(key, String(value))
			}
		}
	}

	const buildUrl = (endpoint: string, params?: QueryParams) => {
		const cleanBase = cleanBaseUrl(baseUrl)
		const cleanEnd = cleanEndpoint(endpoint)
		const fullUrl = constructFullUrl(cleanBase, cleanEnd)
		const url = new URL(fullUrl)

		if (params) {
			addQueryParams(url, params)
		}
		return url.toString()
	}

	const fetcher = async (url: string, options?: RequestInit) => {
		const response = await fetch(url, {
			...options,
			headers: {
				...headers,
				...options?.headers
			}
		})

		if (!response.ok) {
			const error = (await response.json()) as ErrorResponse
			throw new Error(error.errors[0]?.message || 'Erro desconhecido')
		}

		return response.json()
	}

	// Hook for listing with pagination
	const useList = (params?: QueryParams) =>
		useQuery<PaginatedResponse<T>>({
			queryKey: [baseUrl, 'list', params],
			queryFn: async () => {
				const result = await fetcher(buildUrl('', params))
				// Backend wraps paginated response in { message, data: {...} }
				// Unwrap if needed
				if (result.data?.data && result.data.meta) {
					return result.data
				}
				return result
			},
			placeholderData: previousData => previousData
		})

	// Hook for searching by ID
	const useGet = (id: number | string) =>
		useQuery<ApiResponse<T>>({
			queryKey: [baseUrl, 'get', id],
			queryFn: () => fetcher(buildUrl(`/${id}`, undefined)),
			enabled: Boolean(id)
		})

	// Hook for creating
	const useCreate = () => {
		const queryClient = useQueryClient()

		return useMutation<ApiResponse<T>, Error, Partial<T>>({
			mutationFn: data =>
				fetcher(buildUrl('', undefined), {
					method: 'POST',
					body: JSON.stringify(data)
				}),
			onSuccess: () => {
				queryClient.invalidateQueries({queryKey: [baseUrl, 'list']})
			}
		})
	}

	// Hook for updating
	const useUpdate = () => {
		const queryClient = useQueryClient()

		return useMutation<
			ApiResponse<T>,
			Error,
			{id: number | string; data: Partial<T>}
		>({
			mutationFn: ({id, data}) =>
				fetcher(buildUrl(`/${id}`, undefined), {
					method: 'PUT',
					body: JSON.stringify(data)
				}),
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: [baseUrl, 'get', variables.id]
				})
				queryClient.invalidateQueries({queryKey: [baseUrl, 'list']})
			}
		})
	}

	// Hook for deleting
	const useDelete = () => {
		const queryClient = useQueryClient()

		return useMutation<void, Error, number | string>({
			mutationFn: id =>
				fetcher(buildUrl(`/${id}`, undefined), {
					method: 'DELETE'
				}),
			onSuccess: () => {
				queryClient.invalidateQueries({queryKey: [baseUrl, 'list']})
			}
		})
	}

	return {
		useList,
		useGet,
		useCreate,
		useUpdate,
		useDelete
	}
}
