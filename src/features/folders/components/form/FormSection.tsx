import type React from 'react'

interface FormSectionProps {
	title?: string
	children: React.ReactNode
	className?: string
}

export function FormSection({
	title,
	children,
	className = ''
}: FormSectionProps) {
	return (
		<div className={`${className}`}>
			{title && (
				<h3 className='mb-4 font-semibold text-gray-700 text-sm'>{title}</h3>
			)}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{children}
			</div>
		</div>
	)
}
