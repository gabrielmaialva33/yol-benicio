/**
 * ChatInput Component
 * Input field for sending chat messages
 */

import {cn} from '@ui/utils/cn'
import {Send} from 'lucide-react'
import React, {
	type FormEvent,
	type KeyboardEvent,
	useCallback,
	useRef,
	useState
} from 'react'
import {useTranslation} from '@/core/i18n'

interface ChatInputProps {
	onSend: (message: string) => void
	disabled?: boolean
	placeholder?: string
}

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
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Use translated placeholder if not provided
	const finalPlaceholder = placeholder || t('chat.placeholder')

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
			className='border-t border-border bg-surface p-4'
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
					'flex-1 resize-none rounded-lg border border-border bg-surface px-4 py-2 text-sm',
					'focus:outline-none focus:ring-2 focus:ring-brand-cyan',
					'disabled:cursor-not-allowed disabled:opacity-50',
					'max-h-32 overflow-y-auto'
				)}
				disabled={disabled}
				onChange={onChange}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				ref={ref}
				rows={1}
				value={message}
			/>
			<button
				aria-label={t('chat.send')}
				className={cn(
					'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
					'bg-brand-orange text-white transition-colors',
					'hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50'
				)}
				disabled={!message.trim() || disabled}
				type='submit'
			>
				<Send className='h-5 w-5' />
			</button>
		</div>
	)
})

ChatInputField.displayName = 'ChatInputField'

// Sub-component for hint text
function ChatInputHint() {
	const {t} = useTranslation()

	return <div className='mt-2 text-xs text-gray-500'>{t('chat.sendHint')}</div>
}

// Export component
export {ChatInput}
