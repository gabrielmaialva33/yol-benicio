/**
 * ChatWindow Component
 * Container for chat messages with auto-scroll
 */

import {MessageSquare} from 'lucide-react'
import {useEffect, useRef} from 'react'
import {useTranslation} from '@/core/i18n'
import type {ChatMessage as ChatMessageType} from '../types'
import {ChatMessage} from './ChatMessage'
import {StreamingMessage} from './StreamingMessage'

interface ChatWindowProps {
	messages: ChatMessageType[]
	streamingContent?: string
	isStreaming?: boolean
	isLoading?: boolean
}

export function ChatWindow({
	messages,
	streamingContent = '',
	isStreaming = false,
	isLoading = false
}: ChatWindowProps) {
	const {t} = useTranslation()
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
	}, [])

	if (isLoading) {
		return (
			<div className='flex h-full items-center justify-center'>
				<div className='text-center text-gray-500'>
					<MessageSquare className='mx-auto mb-2 h-12 w-12 opacity-30' />
					<p>{t('chat.loadingConversation')}</p>
				</div>
			</div>
		)
	}

	if (messages.length === 0 && !streamingContent) {
		return (
			<div className='flex h-full items-center justify-center'>
				<div className='text-center text-gray-500'>
					<MessageSquare className='mx-auto mb-4 h-16 w-16 opacity-30' />
					<h3 className='mb-2 font-semibold text-lg'>
						{t('chat.startConversation')}
					</h3>
					<p className='text-sm'>{t('chat.startConversationHint')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className='flex-1 space-y-0 overflow-y-auto'>
			{messages.map(message => (
				<ChatMessage key={message.id} message={message} />
			))}

			{/* Streaming message */}
			{(streamingContent || isStreaming) && (
				<StreamingMessage
					content={streamingContent}
					isStreaming={isStreaming}
				/>
			)}

			{/* Auto-scroll anchor */}
			<div ref={messagesEndRef} />
		</div>
	)
}
