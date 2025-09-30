/**
 * Custom hook for chat widget logic
 */

import {useState} from 'react'
import {useTranslation} from '@/core/i18n'
import {streamMessage} from '../api'
import type {ChatMessage} from '../types'

export function useChatWidget() {
	const {t} = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [conversationId, setConversationId] = useState<number | undefined>()

	const handleSend = async (message: string) => {
		const tempConvId = conversationId || -1

		// Add user message
		const userMessage: ChatMessage = {
			id: Date.now(),
			conversation_id: tempConvId,
			role: 'user',
			content: message,
			created_at: new Date().toISOString()
		}
		setMessages(prev => [...prev, userMessage])
		setIsLoading(true)

		// Add AI placeholder
		const aiMessageId = Date.now() + 1
		const aiMessage: ChatMessage = {
			id: aiMessageId,
			conversation_id: tempConvId,
			role: 'assistant',
			content: '',
			created_at: new Date().toISOString()
		}
		setMessages(prev => [...prev, aiMessage])

		try {
			const request = {
				message,
				mode: 'single' as const,
				...(conversationId && {conversation_id: conversationId})
			}

			await streamMessage(request, chunk => {
				if (chunk.done) {
					setIsLoading(false)
					return
				}

				if (chunk.conversation && !conversationId) {
					setConversationId(chunk.conversation.id)
				}

				if (chunk.content) {
					setMessages(prev =>
						prev.map(msg =>
							msg.id === aiMessageId
								? {...msg, content: msg.content + chunk.content}
								: msg
						)
					)
				}
			})
		} catch {
			setMessages(prev =>
				prev.map(msg =>
					msg.id === aiMessageId
						? {...msg, content: t('chat.errorMessage')}
						: msg
				)
			)
			setIsLoading(false)
		}
	}

	const handleClose = () => {
		setIsOpen(false)
		setMessages([])
	}

	return {
		isOpen,
		setIsOpen,
		messages,
		isLoading,
		handleSend,
		handleClose
	}
}
