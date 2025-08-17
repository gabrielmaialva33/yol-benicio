import {Calendar, ChevronDown, Search} from 'lucide-react'
import type React from 'react'

interface FormFieldProps {
	label: string
	value?: string
	onChange?: (value: string) => void
	type?: 'text' | 'select' | 'date' | 'search' | 'textarea'
	placeholder?: string
	options?: Array<{value: string; label: string}>
	disabled?: boolean
	readOnly?: boolean
	className?: string
	icon?: 'calendar' | 'search' | 'dropdown'
	colSpan?: 1 | 2 | 3
}

export function FormField({
	label,
	value = '',
	onChange,
	type = 'text',
	placeholder,
	options = [],
	disabled = false,
	readOnly = false,
	className = '',
	icon,
	colSpan = 1
}: FormFieldProps) {
	// Constants for magic numbers
	const TRIPLE_SPAN = 3
	const DOUBLE_SPAN = 2

	// Determine span class based on colSpan
	let spanClass = ''
	if (colSpan === TRIPLE_SPAN) {
		spanClass = 'lg:col-span-3'
	} else if (colSpan === DOUBLE_SPAN) {
		spanClass = 'lg:col-span-2'
	}

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		if (onChange && !disabled && !readOnly) {
			onChange(e.target.value)
		}
	}

	const baseInputClass = `
		w-full px-3 py-2 border border-gray-300 rounded-lg
		text-sm text-gray-900 placeholder-gray-500
		focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]
		disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
		transition-colors
	`

	return (
		<div className={`${spanClass} ${className}`}>
			<label
				className='block text-xs font-medium text-gray-600 mb-1'
				htmlFor={`field-${label}`}
			>
				{label}
			</label>
			<div className='relative'>
				{(() => {
					if (type === 'select') {
						return (
							<>
								<select
									className={`${baseInputClass} appearance-none pr-10`}
									disabled={disabled}
									id={`field-${label}`}
									onChange={handleChange}
									value={value}
								>
									<option value=''>{placeholder || 'Selecione...'}</option>
									{options.map(option => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
							</>
						)
					}

					if (type === 'textarea') {
						return (
							<textarea
								className={`${baseInputClass} min-h-[80px] resize-none`}
								disabled={disabled}
								id={`field-${label}`}
								onChange={handleChange}
								placeholder={placeholder || `Digite ${label.toLowerCase()}...`}
								readOnly={readOnly}
								value={value}
							/>
						)
					}

					return (
						<>
							<input
								className={`${baseInputClass} ${icon ? 'pr-10' : ''}`}
								disabled={disabled}
								id={`field-${label}`}
								onChange={handleChange}
								placeholder={placeholder}
								readOnly={readOnly}
								type={type === 'date' ? 'date' : 'text'}
								value={value}
							/>
							{icon === 'calendar' && (
								<Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
							)}
							{icon === 'search' && (
								<Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
							)}
						</>
					)
				})()}
			</div>
		</div>
	)
}
