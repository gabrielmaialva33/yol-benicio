/**
 * useDeleteConversation Hook
 * Mutation for deleting conversations
 */

import {useMutation, useQueryClient} from '@tanstack/react-query'
import {deleteConversation} from '../api'

export function useDeleteConversation() {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: (conversationId: number) => deleteConversation(conversationId),
		onSuccess: () => {
			// Invalidate conversations list to refresh
			queryClient.invalidateQueries({queryKey: ['ai-conversations']})
		}
	})

	return {
		deleteConversation: mutation.mutate,
		deleteConversationAsync: mutation.mutateAsync,
		isDeleting: mutation.isPending,
		error: mutation.error
	}
}
