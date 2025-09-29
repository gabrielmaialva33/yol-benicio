import {useQuery} from '@tanstack/react-query'
import {API_BASE_URL} from '../../../config/api'
import {useAuth} from '../../../shared/hooks/auth-context'

interface FavoriteFolder {
	id: string
	name: string
	count: number
}

export function useFavoriteFolders() {
	const {token} = useAuth()

	const {data, isLoading, isError} = useQuery<FavoriteFolder[]>({
		queryKey: ['favoriteFolders'],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/api/v1/folders/favorites`, {
				headers: {
					'Content-Type': 'application/json',
					...(token && {Authorization: `Bearer ${token}`})
				}
			})

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
