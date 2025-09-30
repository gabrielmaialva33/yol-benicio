/**
 * Modal Compound Component
 * A flexible, accessible modal component with animation and focus management
 */

import {cn} from '@ui/utils/cn'
import {AlertCircle, Info, X} from 'lucide-react'
import type React from 'react'
import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {ANIMATION} from '@/core/constants/ui'
import {useTranslation} from '@/core/i18n'
import {createCompoundComponentContext} from './CompoundComponent'

// Types
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type ModalVariant = 'default' | 'danger' | 'success' | 'warning'

// Context
interface ModalContextType {
	isOpen: boolean
	size: ModalSize
	variant: ModalVariant
	preventClose: boolean
	actions: {
		close: () => void
		setPreventClose: (prevent: boolean) => void
	}
}

const [ModalProvider, useModal] =
	createCompoundComponentContext<ModalContextType>('Modal')

// Main Component
interface ModalProps {
	children: React.ReactNode
	isOpen: boolean
	onClose: () => void
	size?: ModalSize
	variant?: ModalVariant
	preventClose?: boolean
	closeOnEscape?: boolean
	closeOnOverlay?: boolean
}

export function Modal({
	children,
	isOpen,
	onClose,
	size = 'md',
	variant = 'default',
	preventClose = false,
	closeOnEscape = true,
	closeOnOverlay: _closeOnOverlay = true
}: ModalProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [isAnimating, setIsAnimating] = useState(false)

	// Handle open/close animation
	useEffect(() => {
		if (isOpen) {
			setIsVisible(true)
			requestAnimationFrame(() => {
				setIsAnimating(true)
			})
		} else {
			setIsAnimating(false)
			const timer = setTimeout(() => {
				setIsVisible(false)
			}, ANIMATION.NORMAL)
			return () => clearTimeout(timer)
		}
	}, [isOpen])

	// Handle escape key
	useEffect(() => {
		if (!(isOpen && closeOnEscape) || preventClose) {
			return
		}

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, closeOnEscape, preventClose, onClose])

	// Lock body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			const originalOverflow = document.body.style.overflow
			document.body.style.overflow = 'hidden'
			return () => {
				document.body.style.overflow = originalOverflow
			}
		}
	}, [isOpen])

	const actions = {
		close: () => !preventClose && onClose(),
		setPreventClose: (_prevent: boolean) => {
			// Placeholder for future implementation
		}
	}

	if (!isVisible) {
		return null
	}

	return createPortal(
		<ModalProvider value={{isOpen, size, variant, preventClose, actions}}>
			<div
				aria-modal='true'
				className={cn(
					'fixed inset-0 z-50 flex items-center justify-center p-4',
					'transition-opacity duration-300',
					isAnimating ? 'opacity-100' : 'opacity-0'
				)}
				role='dialog'
			>
				{/* Backdrop - apenas para visualização, sem interatividade */}
				<div className='absolute inset-0 bg-black/50' role='presentation' />

				{/* Modal */}
				<div
					className={cn(
						'relative z-10 w-full rounded-lg bg-white shadow-xl',
						'transition-all duration-300',
						isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
						getModalSizeClasses(size)
					)}
					role='document'
					tabIndex={-1}
				>
					{children}
				</div>
			</div>
		</ModalProvider>,
		document.body
	)
}

// Sub-component: Header
Modal.Header = function ModalHeader({
	title,
	description,
	showClose = true,
	className
}: {
	title: string
	description?: string
	showClose?: boolean
	className?: string
}) {
	const {variant, preventClose, actions} = useModal()

	return (
		<div
			className={cn(
				'flex items-start justify-between border-b p-6',
				getVariantHeaderClasses(variant),
				className
			)}
		>
			<div className='flex-1'>
				<h2 className='font-semibold text-xl'>{title}</h2>
				{description && (
					<p className='mt-1 text-sm opacity-90'>{description}</p>
				)}
			</div>
			{showClose && !preventClose && (
				<button
					aria-label='Close modal'
					className={cn(
						'ml-4 rounded-lg p-1 transition-colors',
						'hover:bg-black/10'
					)}
					onClick={actions.close}
					type='button'
				>
					<X className='h-5 w-5' />
				</button>
			)}
		</div>
	)
}

// Sub-component: Body
Modal.Body = function ModalBody({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	const {size} = useModal()

	return (
		<div
			className={cn(
				'p-6',
				size === 'full'
					? 'flex-1 overflow-y-auto'
					: 'max-h-[60vh] overflow-y-auto',
				className
			)}
		>
			{children}
		</div>
	)
}

// Sub-component: Footer
Modal.Footer = function ModalFooter({
	children,
	className,
	align = 'right'
}: {
	children: React.ReactNode
	className?: string
	align?: 'left' | 'center' | 'right' | 'between'
}) {
	const alignClasses = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end',
		between: 'justify-between'
	}

	return (
		<div
			className={cn(
				'flex items-center gap-3 border-t p-6',
				alignClasses[align],
				className
			)}
		>
			{children}
		</div>
	)
}

// Sub-component: Confirm Actions
Modal.ConfirmActions = function ModalConfirmActions({
	confirmLabel,
	cancelLabel,
	onConfirm,
	onCancel,
	isLoading = false,
	confirmDisabled = false
}: {
	confirmLabel?: string
	cancelLabel?: string
	onConfirm: () => void
	onCancel?: () => void
	isLoading?: boolean
	confirmDisabled?: boolean
}) {
	const {variant, actions} = useModal()
	const {t} = useTranslation()

	const handleCancel = () => {
		if (onCancel) {
			onCancel()
		} else {
			actions.close()
		}
	}

	return (
		<>
			<button
				className={cn(
					'rounded-lg border border-gray-200 px-4 py-2',
					'transition-colors hover:bg-gray-50',
					'disabled:cursor-not-allowed disabled:opacity-50'
				)}
				disabled={isLoading}
				onClick={handleCancel}
				type='button'
			>
				{cancelLabel || t('common.cancel')}
			</button>
			<button
				className={cn(
					'rounded-lg px-4 py-2 text-white transition-colors',
					'disabled:cursor-not-allowed disabled:opacity-50',
					getVariantButtonClasses(variant)
				)}
				disabled={isLoading || confirmDisabled}
				onClick={onConfirm}
				type='button'
			>
				{isLoading ? t('common.loading') : confirmLabel || t('common.confirm')}
			</button>
		</>
	)
}

// Sub-component: Alert
Modal.Alert = function ModalAlert({
	type = 'info',
	children
}: {
	type?: 'info' | 'warning' | 'error' | 'success'
	children: React.ReactNode
}) {
	const icons = {
		info: <Info className='h-5 w-5' />,
		warning: <AlertCircle className='h-5 w-5' />,
		error: <X className='h-5 w-5' />,
		success: <Check className='h-5 w-5' />
	}

	const classes = {
		info: 'bg-blue-50 text-blue-900 border-blue-200',
		warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
		error: 'bg-red-50 text-red-900 border-red-200',
		success: 'bg-green-50 text-green-900 border-green-200'
	}

	return (
		<div className={cn('flex gap-3 rounded-lg border p-4', classes[type])}>
			<div className='shrink-0'>{icons[type]}</div>
			<div className='flex-1 text-sm'>{children}</div>
		</div>
	)
}

// Utility functions
function getModalSizeClasses(size: ModalSize): string {
	const sizes = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full h-full'
	}
	return sizes[size]
}

function getVariantHeaderClasses(variant: ModalVariant): string {
	const variants = {
		default: 'border-gray-200',
		danger: 'bg-red-50 text-red-900 border-red-200',
		success: 'bg-green-50 text-green-900 border-green-200',
		warning: 'bg-yellow-50 text-yellow-900 border-yellow-200'
	}
	return variants[variant]
}

function getVariantButtonClasses(variant: ModalVariant): string {
	const variants = {
		default: 'bg-brand-cyan hover:bg-cyan-600',
		danger: 'bg-red-500 hover:bg-red-600',
		success: 'bg-green-500 hover:bg-green-600',
		warning: 'bg-yellow-500 hover:bg-yellow-600'
	}
	return variants[variant]
}

// Add missing import
import {Check} from 'lucide-react'

// Convenience Components

// Simple Alert Modal
export function AlertModal({
	isOpen,
	onClose,
	title,
	message,
	variant = 'default'
}: {
	isOpen: boolean
	onClose: () => void
	title: string
	message: string
	variant?: ModalVariant
}) {
	const {t} = useTranslation()

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='sm' variant={variant}>
			<Modal.Header title={title} />
			<Modal.Body>
				<p className='text-gray-700'>{message}</p>
			</Modal.Body>
			<Modal.Footer>
				<button
					className={cn(
						'rounded-lg px-4 py-2 text-white',
						getVariantButtonClasses(variant)
					)}
					onClick={onClose}
					type='button'
				>
					{t('common.ok', 'OK')}
				</button>
			</Modal.Footer>
		</Modal>
	)
}

// Confirmation Modal
export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel,
	cancelLabel,
	variant = 'default'
}: {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	confirmLabel?: string
	cancelLabel?: string
	variant?: ModalVariant
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size='sm' variant={variant}>
			<Modal.Header title={title} />
			<Modal.Body>
				<p className='text-gray-700'>{message}</p>
			</Modal.Body>
			<Modal.Footer>
				<Modal.ConfirmActions
					cancelLabel={cancelLabel}
					confirmLabel={confirmLabel}
					onCancel={onClose}
					onConfirm={onConfirm}
				/>
			</Modal.Footer>
		</Modal>
	)
}

// Example usage:
/*
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  size="lg"
  variant="default"
>
  <Modal.Header
    title="Edit Profile"
    description="Update your personal information"
  />
  <Modal.Body>
    <Form onSubmit={handleSubmit}>
      // Form fields
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Modal.ConfirmActions
      onConfirm={handleSave}
      confirmLabel="Save Changes"
    />
  </Modal.Footer>
</Modal>

// Or use convenience components:
<ConfirmModal
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  variant="danger"
  confirmLabel="Delete"
/>
*/

// Export types
export type {ModalSize, ModalVariant}
