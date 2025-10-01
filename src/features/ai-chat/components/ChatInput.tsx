/**
 * ChatInput Component
 * Enhanced input field for sending chat messages with animations
 */

import {cn} from '@ui/utils/cn'
import {motion} from 'framer-motion'
import {Send} from 'lucide-react'
import React, {
	type FormEvent,
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import {useTranslation} from '@/core/i18n'

interface ChatInputProps {
	onSend: (message: string) => void
	disabled?: boolean
	placeholder?: string
}

// Prompt suggestions that rotate in the placeholder
const PROMPT_SUGGESTIONS = [
	'Pesquisar jurisprudência sobre...',
	'Analisar contrato de...',
	'Calcular prazo processual...',
	'Redigir petição para...',
	'Explicar legislação sobre...'
]

// Extracted handler for auto-resizing
const autoResizeTextarea = (element: HTMLTextAreaElement) => {
	element.style.height = 'auto'
	element.style.height = `${element.scrollHeight}px`
}

// Extracted handler for resetting textarea
const resetTextarea = (element: HTMLTextAreaElement | null) => {
	if (element) {
		element.style.height = 'auto'
	}
}

function ChatInput({onSend, disabled = false, placeholder}: ChatInputProps) {
	const {t} = useTranslation()
	const [message, setMessage] = useState('')
	const [currentSuggestion, setCurrentSuggestion] = useState(0)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Rotate placeholder suggestions
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSuggestion(prev => (prev + 1) % PROMPT_SUGGESTIONS.length)
		}, 3000)

		return () => clearInterval(interval)
	}, [])

	// Use rotating suggestions if no custom placeholder
	const finalPlaceholder =
		placeholder || PROMPT_SUGGESTIONS[currentSuggestion] || t('chat.placeholder')

	const handleSubmit = useCallback(
		(e: FormEvent) => {
			e.preventDefault()
			if (message.trim() && !disabled) {
				onSend(message.trim())
				setMessage('')
				resetTextarea(textareaRef.current)
			}
		},
		[message, disabled, onSend]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTextAreaElement>) => {
			// Submit on Enter (without Shift)
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				handleSubmit(e)
			}
		},
		[handleSubmit]
	)

	const handleInput = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setMessage(e.target.value)
			autoResizeTextarea(e.target)
		},
		[]
	)

	return (
		<form
			className='border-gray-200 border-t bg-white p-4'
			onSubmit={handleSubmit}
		>
			<ChatInputField
				disabled={disabled}
				message={message}
				onChange={handleInput}
				onKeyDown={handleKeyDown}
				placeholder={finalPlaceholder}
				ref={textareaRef}
			/>
			<ChatInputHint />
		</form>
	)
}

// Sub-component for input field
interface ChatInputFieldProps {
	message: string
	disabled?: boolean
	placeholder: string
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
}

const ChatInputField = React.forwardRef<
	HTMLTextAreaElement,
	ChatInputFieldProps
>(({message, disabled, placeholder, onChange, onKeyDown}, ref) => {
	const {t} = useTranslation()

	return (
		<div className='flex gap-2'>
			<textarea
				className={cn(
					'flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all',
					'focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent',
					'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
					'max-h-32 overflow-y-auto',
					'placeholder:text-gray-400 placeholder:transition-opacity placeholder:duration-300'
				)}
				disabled={disabled}
				onChange={onChange}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				ref={ref}
				rows={1}
				value={message}
			/>
			<motion.button
				animate={{
					scale: message.trim() && !disabled ? 1 : 0.95,
					opacity: message.trim() && !disabled ? 1 : 0.5
				}}
				aria-label={t('chat.send')}
				className={cn(
					'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
					'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
					'hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed',
					'shadow-sm hover:shadow-md transition-shadow'
				)}
				disabled={!message.trim() || disabled}
				type='submit'
				whileHover={{scale: 1.05}}
				whileTap={{scale: 0.95}}
			>
				<Send className='h-5 w-5' />
			</motion.button>
		</div>
	)
})

ChatInputField.displayName = 'ChatInputField'

// Sub-component for hint text
function ChatInputHint() {
	const {t} = useTranslation()

	return <div className='mt-2 text-gray-500 text-xs'>{t('chat.sendHint')}</div>
}

// Export component
export {ChatInput}
