import type React from 'react'

interface FormSectionProps {
	title?: string
	children: React.ReactNode
	className?: string
}

export function FormSection({title, children, className = ''}: FormSectionProps) {
	return (
		<div className={`${className}`}>
			{title && (
				<h3 className='text-sm font-semibold text-gray-700 mb-4'>{title}</h3>
			)}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{children}
			</div>
		</div>
	)
}