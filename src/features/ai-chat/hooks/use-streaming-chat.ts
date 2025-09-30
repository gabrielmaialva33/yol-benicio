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

	const sendStreamingMessage = useCallback(
		async (request: SendMessageRequest) => {
			setIsStreaming(true)
			setStreamingContent('')
			setError(null)

			try {
				await streamMessage(request, chunk => {
					if (chunk.done) {
						setIsStreaming(false)
						// Invalidate conversations to refresh
						queryClient.invalidateQueries({queryKey: ['ai-conversations']})
					} else {
						setStreamingContent(prev => prev + chunk.content)
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
		reset
	}
}
