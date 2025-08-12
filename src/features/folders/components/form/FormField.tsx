import {ChevronDown, Calendar, Search} from 'lucide-react'
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
	const spanClass = colSpan === 3 ? 'lg:col-span-3' : colSpan === 2 ? 'lg:col-span-2' : ''
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
			<label className='block text-xs font-medium text-gray-600 mb-1'>
				{label}
			</label>
			<div className='relative'>
				{type === 'select' ? (
					<>
						<select
							className={`${baseInputClass} appearance-none pr-10`}
							value={value}
							onChange={handleChange}
							disabled={disabled}
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
				) : type === 'textarea' ? (
					<textarea
						className={`${baseInputClass} min-h-[80px] resize-none`}
						value={value}
						onChange={handleChange}
						placeholder={placeholder || `Digite ${label.toLowerCase()}...`}
						disabled={disabled}
						readOnly={readOnly}
					/>
				) : (
					<>
						<input
							type={type === 'date' ? 'date' : 'text'}
							className={`${baseInputClass} ${icon ? 'pr-10' : ''}`}
							value={value}
							onChange={handleChange}
							placeholder={placeholder}
							disabled={disabled}
							readOnly={readOnly}
						/>
						{icon === 'calendar' && (
							<Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
						)}
						{icon === 'search' && (
							<Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
						)}
					</>
				)}
			</div>
		</div>
	)
}