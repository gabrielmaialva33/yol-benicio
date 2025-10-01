/**
 * StreamingMessage Component
 * Renders streaming message from AI (SSE) with typewriter effect
 */

import {motion} from 'framer-motion'
import {Bot} from 'lucide-react'
import {memo} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {useTranslation} from '@/core/i18n'
import {useTypewriter} from '../hooks/use-typewriter'

interface StreamingMessageProps {
	content: string
	isStreaming: boolean
}

/** Animated thinking dots component */
function ThinkingDots() {
	return (
		<div className='flex gap-1'>
			{[0, 1, 2].map(i => (
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.5, 1, 0.5]
					}}
					className='h-2 w-2 rounded-full bg-brand-cyan'
					key={i}
					transition={{
						duration: 1,
						repeat: Number.POSITIVE_INFINITY,
						delay: i * 0.2
					}}
				/>
			))}
		</div>
	)
}

/** Blinking cursor component */
function BlinkingCursor() {
	return (
		<motion.span
			animate={{opacity: [1, 0, 1]}}
			aria-hidden='true'
			className='inline-block h-5 w-0.5 bg-brand-cyan'
			transition={{
				duration: 0.8,
				repeat: Number.POSITIVE_INFINITY,
				ease: 'linear'
			}}
		/>
	)
}

export const StreamingMessage = memo(function StreamingMessage({
	content,
	isStreaming
}: StreamingMessageProps) {
	const {t} = useTranslation()

	// Apply typewriter effect to content
	const {displayText, isTyping} = useTypewriter(content, {
		speed: 15,
		varySpeed: true
	})

	if (!(content || isStreaming)) {
		return null
	}

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='flex gap-3 bg-gray-50 p-4'
			initial={{opacity: 0, y: 10}}
			transition={{duration: 0.3}}
		>
			{/* Avatar with gradient animation */}
			<motion.div
				animate={{
					background: isStreaming
						? [
								'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
								'linear-gradient(135deg, #0099cc 0%, #00d4ff 100%)',
								'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
							]
						: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
				}}
				className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white'
				transition={{
					duration: 2,
					repeat: isStreaming ? Number.POSITIVE_INFINITY : 0
				}}
			>
				<Bot className='h-5 w-5' />
			</motion.div>

			{/* Content */}
			<div className='flex-1 space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='font-semibold text-sm'>{t('chat.aiAssistant')}</div>
					{isStreaming && !content && <ThinkingDots />}
				</div>

				<div className='prose prose-sm max-w-none'>
					{displayText ? (
						<div className='relative'>
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{displayText}
							</ReactMarkdown>
							{isTyping && <BlinkingCursor />}
						</div>
					) : (
						<p className='text-gray-500'>{t('chat.thinking')}</p>
					)}
				</div>
			</div>
		</motion.div>
	)
})
