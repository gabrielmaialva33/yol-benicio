/**
 * MessageActions Component
 * Action buttons for chat messages (copy, regenerate, like/dislike)
 */

import {motion} from 'framer-motion'
import {Check, Copy, RefreshCw, ThumbsDown, ThumbsUp} from 'lucide-react'
import {memo, useCallback, useState} from 'react'
import {useTranslation} from '@/core/i18n'

interface MessageActionsProps {
	/** Message content to copy */
	content: string
	/** Whether to show regenerate button (only for assistant messages) */
	showRegenerate?: boolean
	/** Callback for regenerate action */
	onRegenerate?: () => void
	/** Whether the message is from assistant */
	isAssistant?: boolean
}

export const MessageActions = memo(function MessageActions({
	content,
	showRegenerate = false,
	onRegenerate,
	isAssistant = false
}: MessageActionsProps) {
	const {t} = useTranslation()
	const [copied, setCopied] = useState(false)
	const [liked, setLiked] = useState<'up' | 'down' | null>(null)

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(content)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (_error) {
			// Clipboard API not available or permission denied - silent fail
		}
	}, [content])

	const handleLike = useCallback((type: 'up' | 'down') => {
		setLiked(prev => (prev === type ? null : type))
		// TODO: Send feedback to backend
	}, [])

	const handleRegenerate = useCallback(() => {
		if (onRegenerate) {
			onRegenerate()
		}
	}, [onRegenerate])

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='flex items-center gap-1'
			exit={{opacity: 0, y: -5}}
			initial={{opacity: 0, y: -5}}
		>
			{/* Copy button */}
			<ActionButton
				aria-label={t('chat.copy')}
				icon={
					copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />
				}
				onClick={handleCopy}
				title={copied ? t('chat.copied') : t('chat.copy')}
			/>

			{/* Regenerate button (only for assistant) */}
			{showRegenerate && isAssistant && (
				<ActionButton
					aria-label={t('chat.regenerate')}
					icon={<RefreshCw className='h-4 w-4' />}
					onClick={handleRegenerate}
					title={t('chat.regenerate')}
				/>
			)}

			{/* Like/Dislike buttons (only for assistant) */}
			{isAssistant && (
				<>
					<ActionButton
						aria-label={t('chat.likeMessage')}
						icon={<ThumbsUp className='h-4 w-4' />}
						isActive={liked === 'up'}
						onClick={() => handleLike('up')}
						title={t('chat.likeMessage')}
					/>
					<ActionButton
						aria-label={t('chat.dislikeMessage')}
						icon={<ThumbsDown className='h-4 w-4' />}
						isActive={liked === 'down'}
						onClick={() => handleLike('down')}
						title={t('chat.dislikeMessage')}
					/>
				</>
			)}
		</motion.div>
	)
})

/** Reusable action button */
interface ActionButtonProps {
	icon: React.ReactNode
	onClick: () => void
	title: string
	isActive?: boolean
	'aria-label': string
}

function ActionButton({
	icon,
	onClick,
	title,
	isActive = false,
	...props
}: ActionButtonProps) {
	return (
		<motion.button
			className={`
				rounded p-1.5 transition-colors
				hover:bg-gray-200
				${isActive ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-gray-500'}
			`}
			onClick={onClick}
			title={title}
			type='button'
			whileHover={{scale: 1.1}}
			whileTap={{scale: 0.95}}
			{...props}
		>
			{icon}
		</motion.button>
	)
}
