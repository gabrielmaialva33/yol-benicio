/**
 * StreamingMessage Component
 * Renders streaming message from AI (SSE)
 */

import {Bot, Loader2} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface StreamingMessageProps {
	content: string
	isStreaming: boolean
}

export function StreamingMessage({
	content,
	isStreaming
}: StreamingMessageProps) {
	if (!(content || isStreaming)) {
		return null
	}

	return (
		<div className='flex gap-3 bg-gray-50 p-4'>
			{/* Avatar */}
			<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cyan text-white'>
				<Bot className='h-5 w-5' />
			</div>

			{/* Content */}
			<div className='flex-1 space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='font-semibold text-sm'>Assistente IA</div>
					{isStreaming && (
						<Loader2 className='h-4 w-4 animate-spin text-brand-cyan' />
					)}
				</div>
				<div className='prose prose-sm max-w-none'>
					{content ? (
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
					) : (
						<p className='text-gray-500'>Pensando...</p>
					)}
				</div>
			</div>
		</div>
	)
}
