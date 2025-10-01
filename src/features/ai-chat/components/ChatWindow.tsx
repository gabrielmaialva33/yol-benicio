/**
 * ChatWindow Component
 * Container for chat messages with intelligent auto-scroll
 */

import {AnimatePresence, motion} from 'framer-motion'
import {ArrowDown, MessageSquare} from 'lucide-react'
import {useCallback, useEffect, useRef, useState} from 'react'
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
	const containerRef = useRef<HTMLDivElement>(null)
	const [showScrollButton, setShowScrollButton] = useState(false)
	const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

	// Check if user is scrolled to bottom
	const checkScrollPosition = useCallback(() => {
		const container = containerRef.current
		if (!container) {
			return
		}

		const {scrollTop, scrollHeight, clientHeight} = container
		const isAtBottom = scrollHeight - scrollTop - clientHeight < 100 // 100px threshold

		setShouldAutoScroll(isAtBottom)
		setShowScrollButton(!isAtBottom && messages.length > 0)
	}, [messages.length])

	// Scroll to bottom smoothly
	const scrollToBottom = useCallback((smooth = true) => {
		messagesEndRef.current?.scrollIntoView({
			behavior: smooth ? 'smooth' : 'auto'
		})
	}, [])

	// Auto-scroll when new messages arrive or streaming
	useEffect(() => {
		if (shouldAutoScroll || isStreaming) {
			scrollToBottom()
		}
	}, [isStreaming, shouldAutoScroll, scrollToBottom])

	// Initial scroll to bottom
	useEffect(() => {
		scrollToBottom(false)
	}, [scrollToBottom])

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
		<div className='relative flex h-full flex-col'>
			{/* Messages container */}
			<div
				className='flex-1 space-y-0 overflow-y-auto'
				onScroll={checkScrollPosition}
				ref={containerRef}
			>
				{messages.map((message, index) => (
					<ChatMessage index={index} key={message.id} message={message} />
				))}

				{/* Streaming message */}
				{isStreaming && (
					<StreamingMessage
						content={streamingContent}
						isStreaming={isStreaming}
					/>
				)}

				{/* Auto-scroll anchor */}
				<div ref={messagesEndRef} />
			</div>

			{/* Scroll to bottom button */}
			<AnimatePresence>
				{showScrollButton && (
					<motion.button
						animate={{opacity: 1, y: 0}}
						className='absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-cyan text-white shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2'
						exit={{opacity: 0, y: 10}}
						initial={{opacity: 0, y: 10}}
						onClick={() => scrollToBottom()}
						title={t('chat.scrollToBottom')}
						type='button'
					>
						<ArrowDown className='h-5 w-5' />
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	)
}
