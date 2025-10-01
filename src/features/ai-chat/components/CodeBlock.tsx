/**
 * CodeBlock Component
 * Syntax-highlighted code block with copy functionality
 */

import {Check, Copy} from 'lucide-react'
import {memo, useCallback, useState} from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
	/** Programming language */
	language?: string
	/** Code content */
	children: string
	/** Whether to show line numbers */
	showLineNumbers?: boolean
}

export const CodeBlock = memo(function CodeBlock({
	language = 'text',
	children,
	showLineNumbers = true
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(children)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (error) {
			console.error('Failed to copy code:', error)
		}
	}, [children])

	return (
		<div className='not-prose group relative my-4 overflow-hidden rounded-lg border border-gray-700 bg-[#282c34]'>
			{/* Header with language and copy button */}
			<div className='flex items-center justify-between border-gray-700 border-b bg-gray-800 px-4 py-2'>
				<span className='font-mono text-gray-400 text-xs uppercase tracking-wider'>
					{language}
				</span>
				<button
					className='flex items-center gap-1.5 rounded px-2 py-1 font-mono text-gray-400 text-xs transition-colors hover:bg-gray-700 hover:text-white'
					onClick={handleCopy}
					type='button'
				>
					{copied ? (
						<>
							<Check className='h-3.5 w-3.5' />
							<span>Copied!</span>
						</>
					) : (
						<>
							<Copy className='h-3.5 w-3.5' />
							<span>Copy code</span>
						</>
					)}
				</button>
			</div>

			{/* Code content */}
			<div className='overflow-x-auto'>
				<SyntaxHighlighter
					customStyle={{
						margin: 0,
						padding: '1rem',
						background: '#282c34',
						fontSize: '0.875rem'
					}}
					language={language}
					showLineNumbers={showLineNumbers}
					style={oneDark}
					wrapLines
				>
					{children}
				</SyntaxHighlighter>
			</div>
		</div>
	)
})

/** Custom code component for react-markdown */
export function MarkdownCode({
	inline,
	className,
	children,
	...props
}: {
	inline?: boolean
	className?: string
	children?: React.ReactNode
}) {
	const match = /language-(\w+)/.exec(className || '')
	const language = match ? match[1] : 'text'
	const codeString = String(children).replace(/\n$/, '')

	if (inline) {
		return (
			<code
				className='rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800'
				{...props}
			>
				{children}
			</code>
		)
	}

	return <CodeBlock language={language}>{codeString}</CodeBlock>
}
