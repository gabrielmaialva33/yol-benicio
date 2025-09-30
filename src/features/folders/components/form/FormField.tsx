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

const DEFAULT_PLACEHOLDER = 'Selecione...'
const COL_SPAN_2 = 2
const COL_SPAN_3 = 3

function _IconRenderer({
	icon
}: {
	icon?: 'calendar' | 'search' | 'dropdown' | undefined
}) {
	if (!icon) {
		return null
	}

	const iconClass =
		'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none'

	if (icon === 'calendar') {
		return <Calendar className={iconClass} />
	}
	if (icon === 'search') {
		return <Search className={iconClass} />
	}
	return null
}

function _renderFieldByType(
	type: 'text' | 'select' | 'date' | 'search' | 'textarea',
	props: {
		value: string
		onChange: (
			e: React.ChangeEvent<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>
		) => void
		disabled: boolean
		readOnly: boolean
		placeholder?: string | undefined
		label: string
		options: Array<{value: string; label: string}>
		icon?: 'calendar' | 'search' | 'dropdown' | undefined
		baseInputClass: string
	}
) {
	if (type === 'select') {
		return (
			<_SelectField
				baseInputClass={props.baseInputClass}
				disabled={props.disabled}
				onChange={props.onChange}
				options={props.options}
				placeholder={props.placeholder}
				value={props.value}
			/>
		)
	}

	if (type === 'textarea') {
		return (
			<_TextAreaField
				baseInputClass={props.baseInputClass}
				disabled={props.disabled}
				label={props.label}
				onChange={props.onChange}
				placeholder={props.placeholder}
				readOnly={props.readOnly}
				value={props.value}
			/>
		)
	}

	return (
		<_InputField
			baseInputClass={props.baseInputClass}
			disabled={props.disabled}
			icon={props.icon}
			onChange={props.onChange}
			placeholder={props.placeholder}
			readOnly={props.readOnly}
			type={type}
			value={props.value}
		/>
	)
}

function _SelectField({
	value,
	onChange,
	disabled,
	placeholder,
	options,
	baseInputClass
}: {
	value: string
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	disabled: boolean
	placeholder?: string | undefined
	options: Array<{value: string; label: string}>
	baseInputClass: string
}) {
	return (
		<>
			<select
				className={`${baseInputClass} appearance-none pr-10`}
				disabled={disabled}
				onChange={onChange}
				value={value}
			>
				<option value=''>{placeholder || DEFAULT_PLACEHOLDER}</option>
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

function _TextAreaField({
	value,
	onChange,
	disabled,
	readOnly,
	placeholder,
	label,
	baseInputClass
}: {
	value: string
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	disabled: boolean
	readOnly: boolean
	placeholder?: string | undefined
	label: string
	baseInputClass: string
}) {
	return (
		<textarea
			className={`${baseInputClass} min-h-[80px] resize-none`}
			disabled={disabled}
			onChange={onChange}
			placeholder={placeholder || `Digite ${label.toLowerCase()}...`}
			readOnly={readOnly}
			value={value}
		/>
	)
}

function _InputField({
	value,
	onChange,
	disabled,
	readOnly,
	placeholder,
	type,
	icon,
	baseInputClass
}: {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	disabled: boolean
	readOnly: boolean
	placeholder?: string | undefined
	type: 'text' | 'date' | 'search'
	icon?: 'calendar' | 'search' | 'dropdown' | undefined
	baseInputClass: string
}) {
	return (
		<>
			<input
				className={`${baseInputClass} ${icon ? 'pr-10' : ''}`}
				disabled={disabled}
				onChange={onChange}
				placeholder={placeholder}
				readOnly={readOnly}
				type={type === 'date' ? 'date' : 'text'}
				value={value}
			/>
			<_IconRenderer icon={icon} />
		</>
	)
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
	const getSpanClass = () => {
		if (colSpan === COL_SPAN_3) {
			return 'lg:col-span-3'
		}
		if (colSpan === COL_SPAN_2) {
			return 'lg:col-span-2'
		}
		return ''
	}
	const spanClass = getSpanClass()

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
			{/* biome-ignore lint/a11y/noLabelWithoutControl: Label wraps input via sub-components */}
			<label className='block'>
				<span className='block text-xs font-medium text-gray-600 mb-1'>
					{label}
				</span>
				<div className='relative'>
					{_renderFieldByType(type, {
						value,
						onChange: handleChange,
						disabled,
						readOnly,
						placeholder,
						label,
						options,
						icon,
						baseInputClass
					})}
				</div>
			</label>
		</div>
	)
}
