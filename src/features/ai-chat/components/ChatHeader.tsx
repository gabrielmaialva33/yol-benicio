/**
 * ChatHeader Component
 * Header for chat page with title and actions
 */

import {MessageSquare, Trash2} from 'lucide-react'
import {useTranslation} from '@/core/i18n'

interface ChatHeaderProps {
	title?: string | undefined
	conversationId?: number | undefined
	onDeleteConversation?: (() => void) | undefined
}

export function ChatHeader({
	title,
	conversationId,
	onDeleteConversation
}: ChatHeaderProps) {
	const {t} = useTranslation()

	// Use translated title if not provided
	const displayTitle = title || t('chat.title')

	return (
		<div className='flex items-center justify-between border-b border-border bg-surface p-4'>
			<div className='flex items-center gap-3'>
				<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cyan/10'>
					<MessageSquare className='h-5 w-5 text-brand-cyan' />
				</div>
				<div>
					<h1 className='font-semibold text-lg'>{displayTitle}</h1>
					<p className='text-sm text-gray-500'>{t('chat.subtitle')}</p>
				</div>
			</div>

			{conversationId && onDeleteConversation && (
				<button
					className='flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-100'
					onClick={onDeleteConversation}
					title={t('chat.deleteChat')}
					type='button'
				>
					<Trash2 className='h-4 w-4' />
					{t('chat.deleteChat')}
				</button>
			)}
		</div>
	)
}
