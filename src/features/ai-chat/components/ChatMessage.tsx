/**
 * ChatMessage Component
 * Renders individual chat message with markdown support, animations, and actions
 */

import {cn} from '@ui/utils/cn'
import {motion} from 'framer-motion'
import {Bot, User} from 'lucide-react'
import {memo, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type {ChatMessage as ChatMessageType} from '../types'
import {MarkdownCode} from './CodeBlock'
import {MessageActions} from './MessageActions'

interface ChatMessageProps {
	message: ChatMessageType
	/** Index for stagger animation */
	index?: number
}

export const ChatMessage = memo(function ChatMessage({
	message,
	index = 0
}: ChatMessageProps) {
	const isUser = message.role === 'user'
	const isAssistant = message.role === 'assistant'
	const [showActions, setShowActions] = useState(false)

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className={cn(
				'group flex gap-3 p-4 transition-colors',
				isUser && 'bg-blue-50 hover:bg-blue-100/50',
				isAssistant && 'bg-gray-50 hover:bg-gray-100/50'
			)}
			initial={{opacity: 0, y: 20}}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
			transition={{
				duration: 0.3,
				delay: index * 0.05 // Stagger animation
			}}
		>
			{/* Avatar */}
			<motion.div
				className={cn(
					'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
					isUser &&
						'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
					isAssistant &&
						'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white'
				)}
				whileHover={{scale: 1.05}}
			>
				{isUser && <User className='h-5 w-5' />}
				{isAssistant && <Bot className='h-5 w-5' />}
			</motion.div>

			{/* Content */}
			<div className='flex-1 space-y-2'>
				<div className='flex items-center justify-between'>
					<div className='font-semibold text-sm'>
						{isUser ? 'Você' : 'Assistente IA'}
					</div>

					{/* Actions (visible on hover or mobile) */}
					{(showActions || window.innerWidth < 768) && (
						<MessageActions
							content={message.content}
							isAssistant={isAssistant}
							showRegenerate={isAssistant}
						/>
					)}
				</div>

				<div className='prose prose-sm max-w-none'>
					{isAssistant ? (
						<ReactMarkdown
							components={{
								code: MarkdownCode
							}}
							remarkPlugins={[remarkGfm]}
						>
							{message.content}
						</ReactMarkdown>
					) : (
						<p className='whitespace-pre-wrap text-gray-800'>
							{message.content}
						</p>
					)}
				</div>

				<div className='text-gray-500 text-xs'>
					{new Date(message.created_at).toLocaleTimeString('pt-BR', {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</div>
			</div>
		</motion.div>
	)
})
