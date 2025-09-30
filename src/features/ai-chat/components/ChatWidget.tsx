/**
 * ChatWidget Component
 * Floating chat widget in bottom-right corner with expand/collapse functionality
 */

import {MessageSquare, Minimize2, X} from 'lucide-react'
import {useState} from 'react'
import {streamMessage} from '../api'
import type {ChatMessage} from '../types'
import {ChatInput} from './ChatInput'
import {ChatWindow} from './ChatWindow'

export function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [conversationId, setConversationId] = useState<number | undefined>(
		undefined
	)

	const handleSend = async (message: string) => {
		// Temporary conversation ID for new messages
		const tempConvId = conversationId || -1

		// Add user message immediately
		const userMessage: ChatMessage = {
			id: Date.now(),
			conversation_id: tempConvId,
			role: 'user',
			content: message,
			created_at: new Date().toISOString()
		}
		setMessages(prev => [...prev, userMessage])
		setIsLoading(true)

		// Create AI message placeholder
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
			// Stream AI response from real API
			const request: {
				message: string
				conversation_id?: number
				mode?: 'single' | 'multi'
			} = {
				message,
				mode: 'single'
			}

			if (conversationId !== undefined) {
				request.conversation_id = conversationId
			}

			await streamMessage(request, chunk => {
				if (chunk.done) {
					setIsLoading(false)
					return
				}

				// Save conversation ID from first chunk
				if (chunk.conversation && !conversationId) {
					setConversationId(chunk.conversation.id)
				}

				// Update AI message content with streamed chunks
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
			// Handle error
			setMessages(prev =>
				prev.map(msg =>
					msg.id === aiMessageId
						? {
								...msg,
								content:
									'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
							}
						: msg
				)
			)
			setIsLoading(false)
		}
	}

	// Collapsed state - floating button
	if (!isOpen) {
		return (
			<button
				aria-label='Abrir chat com IA'
				className='fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-cyan shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 z-50'
				onClick={() => setIsOpen(true)}
				type='button'
			>
				<MessageSquare className='h-6 w-6 text-white' />
			</button>
		)
	}

	// Expanded state - chat window
	return (
		<div className='fixed bottom-6 right-6 flex flex-col bg-white rounded-lg shadow-2xl w-96 h-[600px] z-50 border border-gray-200'>
			{/* Header */}
			<div className='flex items-center justify-between border-b border-border bg-brand-cyan p-4 rounded-t-lg'>
				<div className='flex items-center gap-3'>
					<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/20'>
						<MessageSquare className='h-4 w-4 text-white' />
					</div>
					<div>
						<h3 className='font-semibold text-sm text-white'>Chat IA</h3>
						<p className='text-xs text-white/80'>Assistente Jurídico</p>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<button
						aria-label='Minimizar chat'
						className='rounded p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50'
						onClick={() => setIsOpen(false)}
						type='button'
					>
						<Minimize2 className='h-4 w-4 text-white' />
					</button>
					<button
						aria-label='Fechar chat'
						className='rounded p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50'
						onClick={() => {
							setIsOpen(false)
							setMessages([])
						}}
						type='button'
					>
						<X className='h-4 w-4 text-white' />
					</button>
				</div>
			</div>

			{/* Chat Messages */}
			<div className='flex-1 overflow-hidden'>
				<ChatWindow isLoading={isLoading} messages={messages} />
			</div>

			{/* Input */}
			<div className='border-t border-gray-200 p-4'>
				<ChatInput disabled={isLoading} onSend={handleSend} />
			</div>
		</div>
	)
}
