import {useQuery} from '@tanstack/react-query'
import {API_BASE_URL} from '../../../config/api'
import {useAuth} from '../../../shared/hooks/auth-context'

/**
 * Folder entity from the API
 */
interface Folder {
	id: string
	title: string
	description?: string
	status: string
	area?: string
	created_at: string
	updated_at: string
}

/**
 * Statistics breakdown by status
 */
interface StatusStats {
	status: string
	count: number
	percentage: number
}

/**
 * Statistics breakdown by area
 */
interface AreaStats {
	area: string
	count: number
	percentage: number
}

/**
 * Dashboard statistics response from the API
 */
export interface DashboardStats {
	total: number
	by_status: StatusStats[]
	by_area: AreaStats[]
	favorites: number
	recent: Folder[]
}

/**
 * API error response structure
 */
interface ApiErrorResponse {
	errors?: Array<{
		message: string
		rule?: string
		field?: string
	}>
	message?: string
}

/**
 * Custom hook for fetching dashboard statistics
 *
 * Provides real-time statistics about folders including:
 * - Total folder count
 * - Distribution by status
 * - Distribution by area
 * - Favorite folders count
 * - Recent folders list
 *
 * @returns Dashboard statistics data with loading and error states
 *
 * @example
 * ```tsx
 * function DashboardWidget() {
 *   const { stats, isLoading, isError, error, refetch } = useDashboardStats()
 *
 *   if (isLoading) return <Spinner />
 *   if (isError) return <Error message={error?.message} />
 *
 *   return (
 *     <div>
 *       <h2>Total Folders: {stats?.total}</h2>
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useDashboardStats() {
	const {token} = useAuth()

	const {data, isLoading, isError, error, refetch} = useQuery<
		DashboardStats,
		Error
	>({
		queryKey: ['dashboard', 'stats'],
		queryFn: async () => {
			if (!token) {
				throw new Error('Authentication token is required')
			}

			const response = await fetch(`${API_BASE_URL}/api/v1/folders/stats`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})

			if (!response.ok) {
				let errorMessage = `Failed to fetch dashboard statistics: ${response.status} ${response.statusText}`

				try {
					const errorData: ApiErrorResponse = await response.json()
					if (errorData.errors?.[0]?.message) {
						errorMessage = errorData.errors[0].message
					} else if (errorData.message) {
						errorMessage = errorData.message
					}
				} catch {
					// Failed to parse error response, use default message
				}

				throw new Error(errorMessage)
			}

			const data: DashboardStats = await response.json()
			return data
		},
		enabled: Boolean(token), // Only run query when token exists
		staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
		refetchOnWindowFocus: false, // Avoid excessive requests on window focus
		retry: 2, // Retry failed requests twice before giving up
		retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000) // Exponential backoff
	})

	return {
		stats: data,
		isLoading,
		isError,
		error: error || null,
		refetch
	}
}
