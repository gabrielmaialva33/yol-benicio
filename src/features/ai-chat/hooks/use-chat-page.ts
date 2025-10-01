/**
 * Custom hook for ChatPage logic
 */

import {useQueryClient} from '@tanstack/react-query'
import {useCallback, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router'
import type {ChatMessage, Conversation} from '../types'
import {useConversation} from './use-conversation'
import {useConversations} from './use-conversations'
import {useDeleteConversation} from './use-delete-conversation'
import {useStreamingChat} from './use-streaming-chat'

export function useChatPage() {
	const {conversationId} = useParams<{conversationId?: string}>()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const currentConversationId = conversationId
		? Number.parseInt(conversationId, 10)
		: undefined

	// Hooks
	const {data: conversations = []} = useConversations()
	const {data: conversation} = useConversation(currentConversationId)
	const {
		sendStreamingMessage,
		streamingContent: streamContent,
		isStreaming,
		newConversationId,
		reset: resetStreaming
	} = useStreamingChat()
	const {deleteConversation, isDeleting} = useDeleteConversation()

	// Current messages
	const messages = conversation?.messages ?? []

	// Handle send message
	const handleSendMessage = useCallback(
		async (message: string) => {
			resetStreaming()

			// Create optimistic user message
			const optimisticMessage: ChatMessage = {
				id: -Date.now(), // Negative ID for temporary message
				conversation_id: currentConversationId || -1,
				role: 'user',
				content: message,
				created_at: new Date().toISOString()
			}

			// Optimistic update - add user message immediately
			if (currentConversationId) {
				queryClient.setQueryData<Conversation>(
					['ai-conversation', currentConversationId],
					old => {
						if (!old) {
							return old
						}
						return {
							...old,
							messages: [...(old.messages || []), optimisticMessage]
						}
					}
				)
			}

			const request: {
				message: string
				mode: 'single' | 'multi'
				conversation_id?: number
			} = {message, mode: 'single'}

			if (currentConversationId) {
				request.conversation_id = currentConversationId
			}

			await sendStreamingMessage(request)
		},
		[currentConversationId, sendStreamingMessage, resetStreaming, queryClient]
	)

	// Handle new conversation
	const handleNewConversation = useCallback(() => {
		navigate('/dashboard/chat')
		resetStreaming()
	}, [navigate, resetStreaming])

	// Handle delete conversation
	const handleDeleteConversation = useCallback(
		(id: number) => {
			deleteConversation(id, {
				onSuccess: () => {
					if (id === currentConversationId) {
						navigate('/dashboard/chat')
					}
				}
			})
		},
		[deleteConversation, currentConversationId, navigate]
	)

	// Handle delete current conversation
	const handleDeleteCurrentConversation = useCallback(() => {
		if (currentConversationId) {
			handleDeleteConversation(currentConversationId)
		}
	}, [currentConversationId, handleDeleteConversation])

	// Reset streaming when conversation changes
	useEffect(() => {
		resetStreaming()
	}, [resetStreaming])

	// Navigate to new conversation after creation
	useEffect(() => {
		if (newConversationId && !currentConversationId && !isStreaming) {
			navigate(`/dashboard/chat/${newConversationId}`)
		}
	}, [newConversationId, currentConversationId, isStreaming, navigate])

	return {
		conversations,
		messages,
		streamContent,
		isStreaming,
		isDeleting,
		currentConversationId,
		conversation,
		handleSendMessage,
		handleNewConversation,
		handleDeleteConversation,
		handleDeleteCurrentConversation
	}
}
