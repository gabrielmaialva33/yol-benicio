/**
 * useConversations Hook
 * Fetches list of all conversations
 */

import {useAuth} from '@shared/hooks/use-auth-hook'
import {useQuery} from '@tanstack/react-query'
import {CACHE_TIMES} from '@/core/constants/cache'
import {getConversations} from '../api'

export function useConversations() {
	const {token} = useAuth()

	return useQuery({
		queryKey: ['ai-conversations'],
		queryFn: getConversations,
		enabled: Boolean(token),
		staleTime: CACHE_TIMES.STALE.MEDIUM, // 5 minutes
		gcTime: CACHE_TIMES.GC.DEFAULT // 10 minutes
	})
}
