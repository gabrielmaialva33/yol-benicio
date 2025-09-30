/**
 * Form Compound Component
 * A flexible, composable form component with validation and error handling
 */

import {cn} from '@ui/utils/cn'
import {AlertCircle, Check, Eye, EyeOff, X} from 'lucide-react'
import type React from 'react'
import {useCallback, useId, useState} from 'react'
import {useTranslation} from '@/core/i18n'
import {createCompoundComponentContext} from './CompoundComponent'

const REQUIRED_FIELD_INDICATOR = '*'

// Types
interface FormField {
	name: string
	value: any
	error?: string
	touched?: boolean
}

interface FormErrors {
	[key: string]: string | undefined
}

interface FormValues {
	[key: string]: any
}

interface FormValidationRule {
	validate: (value: any, values?: FormValues) => boolean
	message: string
}

interface FormFieldConfig {
	name: string
	label: string
	type?:
		| 'text'
		| 'email'
		| 'password'
		| 'number'
		| 'tel'
		| 'url'
		| 'textarea'
		| 'select'
		| 'checkbox'
		| 'radio'
	placeholder?: string
	required?: boolean
	disabled?: boolean
	rules?: FormValidationRule[]
	options?: Array<{value: string; label: string}>
	rows?: number
	autoComplete?: string
}

// Context
interface FormContextType {
	values: FormValues
	errors: FormErrors
	touched: Set<string>
	isSubmitting: boolean
	isDirty: boolean
	isValid: boolean
	actions: {
		setValue: (name: string, value: any) => void
		setError: (name: string, error: string) => void
		clearError: (name: string) => void
		setTouched: (name: string) => void
		validate: (name?: string) => boolean
		reset: () => void
		submit: () => Promise<void>
	}
}

const [FormProvider, useForm] =
	createCompoundComponentContext<FormContextType>('Form')

// Main Component
interface FormProps {
	children: React.ReactNode
	initialValues?: FormValues
	onSubmit: (values: FormValues) => Promise<void> | void
	onValidate?: (values: FormValues) => FormErrors
	className?: string
}

export function Form({
	children,
	initialValues = {},
	onSubmit,
	onValidate,
	className
}: FormProps) {
	const [values, setValues] = useState<FormValues>(initialValues)
	const [errors, setErrors] = useState<FormErrors>({})
	const [touched, setTouched] = useState<Set<string>>(new Set())
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)
	const isValid = Object.keys(errors).length === 0

	const validate = useCallback(
		(name?: string): boolean => {
			if (onValidate) {
				const validationErrors = onValidate(values)

				if (name) {
					if (validationErrors[name]) {
						setErrors(prev => ({...prev, [name]: validationErrors[name]}))
						return false
					}
					setErrors(prev => {
						const newErrors = {...prev}
						delete newErrors[name]
						return newErrors
					})
					return true
				}
				setErrors(validationErrors)
				return Object.keys(validationErrors).length === 0
			}
			return true
		},
		[values, onValidate]
	)

	const actions = {
		setValue: (name: string, value: any) => {
			setValues(prev => ({...prev, [name]: value}))
		},
		setError: (name: string, error: string) => {
			setErrors(prev => ({...prev, [name]: error}))
		},
		clearError: (name: string) => {
			setErrors(prev => {
				const newErrors = {...prev}
				delete newErrors[name]
				return newErrors
			})
		},
		setTouched: (name: string) => {
			setTouched(prev => new Set(prev).add(name))
			validate(name)
		},
		validate,
		reset: () => {
			setValues(initialValues)
			setErrors({})
			setTouched(new Set())
		},
		submit: async () => {
			// Touch all fields
			const allFieldNames = Object.keys(values)
			setTouched(new Set(allFieldNames))

			// Validate all fields
			if (!validate()) {
				return
			}

			// Submit
			setIsSubmitting(true)
			try {
				await onSubmit(values)
			} finally {
				setIsSubmitting(false)
			}
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		actions.submit()
	}

	return (
		<FormProvider
			value={{
				values,
				errors,
				touched,
				isSubmitting,
				isDirty,
				isValid,
				actions
			}}
		>
			<form className={className} onSubmit={handleSubmit}>
				{children}
			</form>
		</FormProvider>
	)
}

// Sub-component: Field
interface FieldProps extends Omit<FormFieldConfig, 'name'> {
	name: string
	className?: string
}

Form.Field = function FormField({
	name,
	label,
	type = 'text',
	placeholder,
	required = false,
	disabled = false,
	rules: _rules = [],
	options = [],
	rows = 3,
	autoComplete,
	className
}: FieldProps) {
	const {values, errors, touched, actions} = useForm()
	const {t} = useTranslation()
	const id = useId()
	const [showPassword, setShowPassword] = useState(false)

	const value = values[name] || ''
	const error = touched.has(name) ? errors[name] : undefined
	const hasError = Boolean(error)

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const newValue =
			type === 'checkbox'
				? (e.target as HTMLInputElement).checked
				: e.target.value
		actions.setValue(name, newValue)
	}

	const handleBlur = () => {
		actions.setTouched(name)
	}

	const renderInput = () => {
		const baseClasses = cn(
			'w-full rounded-lg border px-3 py-2 transition-colors',
			'focus:outline-none focus:ring-2',
			hasError
				? 'border-red-500 focus:ring-red-500'
				: 'border-gray-200 focus:ring-brand-cyan',
			disabled && 'bg-gray-50 cursor-not-allowed opacity-50'
		)

		switch (type) {
			case 'textarea':
				return (
					<textarea
						className={baseClasses}
						disabled={disabled}
						id={id}
						name={name}
						onBlur={handleBlur}
						onChange={handleChange}
						placeholder={placeholder}
						rows={rows}
						value={value}
					/>
				)

			case 'select':
				return (
					<select
						className={baseClasses}
						disabled={disabled}
						id={id}
						name={name}
						onBlur={handleBlur}
						onChange={handleChange}
						value={value}
					>
						<option value=''>{placeholder || t('common.select')}</option>
						{options.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				)

			case 'checkbox':
				return (
					<div className='flex items-center'>
						<input
							checked={value}
							className={cn(
								'h-4 w-4 rounded border-gray-300',
								'focus:ring-2 focus:ring-brand-cyan',
								disabled && 'cursor-not-allowed opacity-50'
							)}
							disabled={disabled}
							id={id}
							name={name}
							onBlur={handleBlur}
							onChange={handleChange}
							type='checkbox'
						/>
						<label className='ml-2 text-gray-700 text-sm' htmlFor={id}>
							{label}
						</label>
					</div>
				)

			case 'password':
				return (
					<div className='relative'>
						<input
							autoComplete={autoComplete}
							className={cn(baseClasses, 'pr-10')}
							disabled={disabled}
							id={id}
							name={name}
							onBlur={handleBlur}
							onChange={handleChange}
							placeholder={placeholder}
							type={showPassword ? 'text' : 'password'}
							value={value}
						/>
						<button
							className='-translate-y-1/2 absolute top-1/2 right-3 text-gray-400 hover:text-gray-600'
							onClick={() => setShowPassword(!showPassword)}
							type='button'
						>
							{showPassword ? (
								<EyeOff className='h-4 w-4' />
							) : (
								<Eye className='h-4 w-4' />
							)}
						</button>
					</div>
				)

			default:
				return (
					<input
						autoComplete={autoComplete}
						className={baseClasses}
						disabled={disabled}
						id={id}
						name={name}
						onBlur={handleBlur}
						onChange={handleChange}
						placeholder={placeholder}
						type={type}
						value={value}
					/>
				)
		}
	}

	if (type === 'checkbox') {
		return (
			<div className={className}>
				{renderInput()}
				{hasError && <p className='mt-1 text-red-500 text-sm'>{error}</p>}
			</div>
		)
	}

	return (
		<div className={className}>
			<label
				className='mb-1 block font-medium text-gray-700 text-sm'
				htmlFor={id}
			>
				{label}
				{required && (
					<span className='ml-1 text-red-500'>{REQUIRED_FIELD_INDICATOR}</span>
				)}
			</label>
			{renderInput()}
			{hasError && (
				<p className='mt-1 flex items-center gap-1 text-red-500 text-sm'>
					<AlertCircle className='h-3 w-3' />
					{error}
				</p>
			)}
		</div>
	)
}

// Sub-component: Section
Form.Section = function FormSection({
	title,
	description,
	children,
	className
}: {
	title?: string
	description?: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn('space-y-4', className)}>
			{(title || description) && (
				<div>
					{title && (
						<h3 className='font-semibold text-gray-900 text-lg'>{title}</h3>
					)}
					{description && (
						<p className='text-gray-600 text-sm'>{description}</p>
					)}
				</div>
			)}
			<div className='space-y-4'>{children}</div>
		</div>
	)
}

// Sub-component: Actions
Form.Actions = function FormActions({
	children,
	className
}: {
	children?: React.ReactNode
	className?: string
}) {
	const {isDirty, isValid, isSubmitting, actions} = useForm()
	const {t} = useTranslation()

	return (
		<div className={cn('flex items-center justify-end gap-4 pt-4', className)}>
			{children || (
				<>
					<button
						className={cn(
							'rounded-lg border border-gray-200 px-4 py-2',
							'transition-colors hover:bg-gray-50',
							'disabled:cursor-not-allowed disabled:opacity-50'
						)}
						disabled={!isDirty || isSubmitting}
						onClick={actions.reset}
						type='button'
					>
						{t('common.cancel')}
					</button>
					<button
						className={cn(
							'rounded-lg bg-brand-cyan px-4 py-2 text-white',
							'transition-colors hover:bg-cyan-600',
							'disabled:cursor-not-allowed disabled:opacity-50'
						)}
						disabled={!(isDirty && isValid) || isSubmitting}
						type='submit'
					>
						{isSubmitting ? t('common.loading') : t('common.save')}
					</button>
				</>
			)}
		</div>
	)
}

// Sub-component: Error Summary
Form.ErrorSummary = function FormErrorSummary() {
	const {errors, touched} = useForm()
	const {t} = useTranslation()

	const visibleErrors = Object.entries(errors).filter(([key]) =>
		touched.has(key)
	)

	if (visibleErrors.length === 0) {
		return null
	}

	return (
		<div className='rounded-lg border border-red-200 bg-red-50 p-4'>
			<div className='flex items-start gap-3'>
				<AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-red-500' />
				<div className='flex-1'>
					<h4 className='font-semibold text-red-900'>
						{t('errors.validation')}
					</h4>
					<ul className='mt-2 list-inside list-disc space-y-1'>
						{visibleErrors.map(([key, error]) => (
							<li className='text-red-700 text-sm' key={key}>
								{error}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

// Sub-component: Success Message
Form.Success = function FormSuccess({
	message,
	onClose
}: {
	message: string
	onClose?: () => void
}) {
	return (
		<div className='rounded-lg border border-green-200 bg-green-50 p-4'>
			<div className='flex items-start justify-between gap-3'>
				<div className='flex items-start gap-3'>
					<Check className='mt-0.5 h-5 w-5 shrink-0 text-green-500' />
					<p className='text-green-700 text-sm'>{message}</p>
				</div>
				{onClose && (
					<button
						className='text-green-500 hover:text-green-700'
						onClick={onClose}
						type='button'
					>
						<X className='h-4 w-4' />
					</button>
				)}
			</div>
		</div>
	)
}

// Example usage:
/*
<Form
  initialValues={{email: '', password: ''}}
  onSubmit={handleSubmit}
  onValidate={validateForm}
>
  <Form.Section title="Login" description="Enter your credentials">
    <Form.Field
      name="email"
      label="Email"
      type="email"
      required
      placeholder="your@email.com"
    />
    <Form.Field
      name="password"
      label="Password"
      type="password"
      required
    />
  </Form.Section>

  <Form.ErrorSummary />
  <Form.Actions />
</Form>
*/

// Export types
export type {
	FormField,
	FormErrors,
	FormValues,
	FormValidationRule,
	FormFieldConfig
}
