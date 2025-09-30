/**
 * useChat Hook
 * Mutation for sending chat messages (non-streaming)
 */

import {useMutation, useQueryClient} from '@tanstack/react-query'
import {sendMessage} from '../api'
import type {SendMessageRequest} from '../types'

export function useChat() {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: (request: SendMessageRequest) => sendMessage(request),
		onSuccess: () => {
			// Invalidate conversations list to refresh
			queryClient.invalidateQueries({queryKey: ['ai-conversations']})
		}
	})

	return {
		sendMessage: mutation.mutate,
		sendMessageAsync: mutation.mutateAsync,
		isLoading: mutation.isPending,
		error: mutation.error,
		data: mutation.data
	}
}
