/**
 * useConversations Hook
 * Fetches list of all conversations
 */

import {useAuth} from '@shared/hooks/use-auth-hook'
import {useQuery} from '@tanstack/react-query'
import {getConversations} from '../api'

export function useConversations() {
	const {token} = useAuth()

	return useQuery({
		queryKey: ['ai-conversations'],
		queryFn: getConversations,
		enabled: Boolean(token),
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10 // 10 minutes
	})
}
