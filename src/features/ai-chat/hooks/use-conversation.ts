/**
 * useConversation Hook
 * Fetches a specific conversation with messages
 */

import {useAuth} from '@shared/hooks/use-auth-hook'
import {useQuery} from '@tanstack/react-query'
import {getConversation} from '../api'

export function useConversation(conversationId?: number) {
	const {token} = useAuth()

	return useQuery({
		queryKey: ['ai-conversation', conversationId],
		queryFn: () => getConversation(conversationId!),
		enabled: Boolean(token) && Boolean(conversationId),
		staleTime: 1000 * 60, // 1 minute
		gcTime: 1000 * 60 * 5 // 5 minutes
	})
}
