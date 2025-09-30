/**
 * ChatInput Component
 * Input field for sending chat messages
 */

import {cn} from '@ui/utils/cn'
import {Send} from 'lucide-react'
import {type FormEvent, type KeyboardEvent, useRef, useState} from 'react'

interface ChatInputProps {
	onSend: (message: string) => void
	disabled?: boolean
	placeholder?: string
}

export function ChatInput({
	onSend,
	disabled = false,
	placeholder = 'Digite sua mensagem...'
}: ChatInputProps) {
	const [message, setMessage] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (message.trim() && !disabled) {
			onSend(message.trim())
			setMessage('')
			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto'
			}
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		// Submit on Enter (without Shift)
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e)
		}
	}

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)
		// Auto-resize textarea
		e.target.style.height = 'auto'
		e.target.style.height = `${e.target.scrollHeight}px`
	}

	return (
		<form
			className='border-t border-border bg-surface p-4'
			onSubmit={handleSubmit}
		>
			<div className='flex gap-2'>
				<textarea
					className={cn(
						'flex-1 resize-none rounded-lg border border-border bg-surface px-4 py-2 text-sm',
						'focus:outline-none focus:ring-2 focus:ring-brand-cyan',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'max-h-32 overflow-y-auto'
					)}
					disabled={disabled}
					onChange={handleInput}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					ref={textareaRef}
					rows={1}
					value={message}
				/>
				<button
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
			<div className='mt-2 text-xs text-gray-500'>
				Pressione Enter para enviar, Shift+Enter para quebrar linha
			</div>
		</form>
	)
}
