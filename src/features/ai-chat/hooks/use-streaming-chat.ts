/**
 * useStreamingChat Hook
 * Custom hook for SSE streaming chat messages
 */

import {useQueryClient} from '@tanstack/react-query'
import {useCallback, useState} from 'react'
import {streamMessage} from '../api'
import type {SendMessageRequest} from '../types'

export function useStreamingChat() {
	const queryClient = useQueryClient()
	const [isStreaming, setIsStreaming] = useState(false)
	const [streamingContent, setStreamingContent] = useState('')
	const [error, setError] = useState<Error | null>(null)
	const [newConversationId, setNewConversationId] = useState<number | null>(
		null
	)

	const sendStreamingMessage = useCallback(
		async (request: SendMessageRequest) => {
			setIsStreaming(true)
			setStreamingContent('')
			setError(null)
			setNewConversationId(null)

			try {
				await streamMessage(request, chunk => {
					if (chunk.done) {
						setIsStreaming(false)

						// Invalidate queries based on conversation type
						if (request.conversation_id) {
							// Existing conversation - invalidate specific conversation
							queryClient.invalidateQueries({
								queryKey: ['ai-conversation', request.conversation_id]
							})
						} else {
							// New conversation - invalidate conversations list
							queryClient.invalidateQueries({queryKey: ['ai-conversations']})

							// Also invalidate the new conversation if we have its ID
							if (chunk.conversation?.id) {
								queryClient.invalidateQueries({
									queryKey: ['ai-conversation', chunk.conversation.id]
								})
							}
						}

						// Clear streaming after small delay to allow refetch
						setTimeout(() => {
							setStreamingContent('')
						}, 200)
					} else {
						setStreamingContent(prev => prev + chunk.content)
						// Capture new conversation ID if it's a new conversation
						if (chunk.conversation?.id && !request.conversation_id) {
							setNewConversationId(chunk.conversation.id)
						}
					}
				})
			} catch (err) {
				setError(err as Error)
				setIsStreaming(false)
			}
		},
		[queryClient]
	)

	const reset = useCallback(() => {
		setStreamingContent('')
		setError(null)
		setIsStreaming(false)
	}, [])

	return {
		sendStreamingMessage,
		isStreaming,
		streamingContent,
		error,
		reset,
		newConversationId
	}
}
