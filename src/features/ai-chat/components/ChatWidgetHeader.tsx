/**
 * Chat widget header component
 */

import {MessageSquare, Minimize2, X} from 'lucide-react'
import {useTranslation} from '@/core/i18n'

interface ChatWidgetHeaderProps {
	onMinimize: () => void
	onClose: () => void
}

export function ChatWidgetHeader({onMinimize, onClose}: ChatWidgetHeaderProps) {
	const {t} = useTranslation()

	return (
		<div className='flex items-center justify-between rounded-t-lg border-border border-b bg-brand-cyan p-4'>
			<div className='flex items-center gap-3'>
				<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/20'>
					<MessageSquare className='h-4 w-4 text-white' />
				</div>
				<div>
					<h3 className='font-semibold text-sm text-white'>
						{t('chat.title')}
					</h3>
					<p className='text-white/80 text-xs'>{t('chat.subtitle')}</p>
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<button
					aria-label={t('chat.minimize')}
					className='rounded p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50'
					onClick={onMinimize}
					type='button'
				>
					<Minimize2 className='h-4 w-4 text-white' />
				</button>
				<button
					aria-label={t('chat.close')}
					className='rounded p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50'
					onClick={onClose}
					type='button'
				>
					<X className='h-4 w-4 text-white' />
				</button>
			</div>
		</div>
	)
}
