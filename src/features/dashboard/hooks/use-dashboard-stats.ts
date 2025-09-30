import {useQuery} from '@tanstack/react-query'
import {API_BASE_URL} from '../../../config/api'
import {useAuth} from '../../../shared/hooks/auth-context'

// Time unit constants
const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const MINUTES_TO_MS = SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND

// Cache and retry configuration constants
const STALE_TIME_MINUTES = 5
const CACHE_TIME_MINUTES = 10
const STALE_TIME_MS = STALE_TIME_MINUTES * MINUTES_TO_MS // 5 minutes
const CACHE_TIME_MS = CACHE_TIME_MINUTES * MINUTES_TO_MS // 10 minutes
const MAX_RETRY_ATTEMPTS = 2 // Retry failed requests twice
const INITIAL_RETRY_DELAY_MS = MILLISECONDS_PER_SECOND // Initial retry delay
const RETRY_BACKOFF_EXPONENT = 2 // Exponential backoff multiplier
const MAX_RETRY_DELAY_SECONDS = 30
const MAX_RETRY_DELAY_MS = MAX_RETRY_DELAY_SECONDS * MILLISECONDS_PER_SECOND // Maximum retry delay

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
interface DashboardStats {
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
function useDashboardStats() {
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

			const statsData: DashboardStats = await response.json()
			return statsData
		},
		enabled: Boolean(token), // Only run query when token exists
		staleTime: STALE_TIME_MS, // Data is considered fresh for 5 minutes
		gcTime: CACHE_TIME_MS, // Cache time (formerly cacheTime)
		refetchOnWindowFocus: false, // Avoid excessive requests on window focus
		retry: MAX_RETRY_ATTEMPTS, // Retry failed requests before giving up
		retryDelay: attemptIndex =>
			Math.min(
				INITIAL_RETRY_DELAY_MS * RETRY_BACKOFF_EXPONENT ** attemptIndex,
				MAX_RETRY_DELAY_MS
			) // Exponential backoff
	})

	return {
		stats: data,
		isLoading,
		isError,
		error: error || null,
		refetch
	}
}

// Export types and hook at the end per style guidelines
export type {DashboardStats}
export {useDashboardStats}
