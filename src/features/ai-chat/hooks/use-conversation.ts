/**
 * useConversation Hook
 * Fetches a specific conversation with messages
 */

import {useAuth} from '@shared/hooks/use-auth-hook'
import {useQuery} from '@tanstack/react-query'
import {CACHE_TIMES} from '@/core/constants/cache'
import {getConversation} from '../api'

export function useConversation(conversationId?: number) {
	const {token} = useAuth()

	return useQuery({
		queryKey: ['ai-conversation', conversationId],
		queryFn: () => {
			if (!conversationId) {
				throw new Error('Conversation ID is required')
			}
			return getConversation(conversationId)
		},
		enabled: Boolean(token) && Boolean(conversationId),
		staleTime: 0, // Always refetch when query is invalidated
		gcTime: CACHE_TIMES.FIVE_MINUTES
	})
}
