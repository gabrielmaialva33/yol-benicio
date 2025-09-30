/**
 * Floating button component for chat widget
 */

import {MessageSquare} from 'lucide-react'
import {useTranslation} from '@/core/i18n'

interface ChatFloatingButtonProps {
	onClick: () => void
}

export function ChatFloatingButton({onClick}: ChatFloatingButtonProps) {
	const {t} = useTranslation()

	return (
		<button
			aria-label={t('chat.openChat')}
			className='fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-cyan shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 z-50'
			onClick={onClick}
			type='button'
		>
			<MessageSquare className='h-6 w-6 text-white' />
		</button>
	)
}
