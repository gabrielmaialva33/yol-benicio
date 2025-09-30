import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {API_BASE_URL} from '../../../config/api'
import {useAuth} from '../../../shared/hooks/auth-context'

interface FavoriteFolder {
	id: number
	code: string
	title: string
	client_name: string
	color: string
}

export function useFavoriteFolders() {
	const {token} = useAuth()

	const {data, isLoading, isError} = useQuery<FavoriteFolder[]>({
		queryKey: ['favoriteFolders'],
		queryFn: async () => {
			const response = await fetch(
				`${API_BASE_URL}/api/dashboard/favorite-folders`,
				{
					headers: {
						'Content-Type': 'application/json',
						...(token && {Authorization: `Bearer ${token}`})
					}
				}
			)

			if (!response.ok) {
				throw new Error('Failed to fetch favorite folders')
			}

			return response.json()
		}
	})

	return {
		favoriteFolders: data ?? [],
		isLoading,
		isError
	}
}

export function useToggleFavoriteFolder() {
	const {token} = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			folderId,
			isFavorite
		}: {
			folderId: number
			isFavorite: boolean
		}) => {
			const method = isFavorite ? 'DELETE' : 'POST'
			const response = await fetch(
				`${API_BASE_URL}/api/dashboard/favorite-folders/${folderId}`,
				{
					method,
					headers: {
						'Content-Type': 'application/json',
						...(token && {Authorization: `Bearer ${token}`})
					}
				}
			)

			if (!response.ok) {
				throw new Error('Failed to toggle favorite folder')
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['favoriteFolders']})
		}
	})
}
