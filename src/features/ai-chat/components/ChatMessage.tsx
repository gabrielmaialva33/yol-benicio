/**
 * ChatMessage Component
 * Renders individual chat message with markdown support
 */

import {cn} from '@ui/utils/cn'
import {Bot, User} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type {ChatMessage as ChatMessageType} from '../types'

interface ChatMessageProps {
	message: ChatMessageType
}

export function ChatMessage({message}: ChatMessageProps) {
	const isUser = message.role === 'user'
	const isAssistant = message.role === 'assistant'

	return (
		<div
			className={cn(
				'flex gap-3 p-4',
				isUser && 'bg-blue-50',
				isAssistant && 'bg-gray-50'
			)}
		>
			{/* Avatar */}
			<div
				className={cn(
					'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
					isUser && 'bg-brand-orange text-white',
					isAssistant && 'bg-brand-cyan text-white'
				)}
			>
				{isUser && <User className='h-5 w-5' />}
				{isAssistant && <Bot className='h-5 w-5' />}
			</div>

			{/* Content */}
			<div className='flex-1 space-y-2'>
				<div className='font-semibold text-sm'>
					{isUser ? 'Você' : 'Assistente IA'}
				</div>
				<div className='prose prose-sm max-w-none'>
					{isAssistant ? (
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{message.content}
						</ReactMarkdown>
					) : (
						<p className='whitespace-pre-wrap'>{message.content}</p>
					)}
				</div>
				<div className='text-xs text-gray-500'>
					{new Date(message.created_at).toLocaleTimeString('pt-BR', {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</div>
			</div>
		</div>
	)
}
