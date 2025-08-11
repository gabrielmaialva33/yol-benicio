import {cn} from '@shared/ui/utils/cn'

interface SkeletonProps {
	className?: string
	variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
	width?: string | number
	height?: string | number
	animation?: 'pulse' | 'wave' | 'none'
}

/**
 * Componente Skeleton para loading states
 */
export function Skeleton({
	className,
	variant = 'text',
	width,
	height,
	animation = 'pulse'
}: SkeletonProps) {
	const variantClasses = {
		text: 'rounded',
		circular: 'rounded-full',
		rectangular: 'rounded-none',
		rounded: 'rounded-lg'
	}

	const animationClasses = {
		pulse: 'animate-pulse',
		wave: 'animate-shimmer',
		none: ''
	}

	return (
		<div
			className={cn(
				'bg-gray-200',
				variantClasses[variant],
				animationClasses[animation],
				className
			)}
			style={{
				width: width || '100%',
				height: height || (variant === 'text' ? '1em' : '100%')
			}}
		/>
	)
}

/**
 * Container para múltiplos skeletons
 */
export function SkeletonContainer({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	return <div className={cn('space-y-3', className)}>{children}</div>
}

/**
 * Skeleton para cards
 */
export function CardSkeleton({className}: {className?: string}) {
	return (
		<div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
			<SkeletonContainer>
				<Skeleton variant='rectangular' height={20} width='40%' />
				<Skeleton variant='text' height={16} />
				<Skeleton variant='text' height={16} width='80%' />
				<div className='flex gap-4 mt-4'>
					<Skeleton variant='rounded' height={32} width={100} />
					<Skeleton variant='rounded' height={32} width={100} />
				</div>
			</SkeletonContainer>
		</div>
	)
}

/**
 * Skeleton para tabelas
 */
export function TableSkeleton({rows = 5}: {rows?: number}) {
	return (
		<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
			<div className='border-b bg-gray-50 p-4'>
				<Skeleton variant='rectangular' height={20} width='30%' />
			</div>
			<div className='divide-y'>
				{Array.from({length: rows}).map((_, index) => (
					<div key={index} className='p-4 flex gap-4'>
						<Skeleton variant='circular' width={40} height={40} />
						<div className='flex-1 space-y-2'>
							<Skeleton variant='text' height={16} width='60%' />
							<Skeleton variant='text' height={14} width='40%' />
						</div>
						<Skeleton variant='rounded' height={32} width={80} />
					</div>
				))}
			</div>
		</div>
	)
}

/**
 * Skeleton para lista de items
 */
export function ListSkeleton({items = 3}: {items?: number}) {
	return (
		<div className='space-y-3'>
			{Array.from({length: items}).map((_, index) => (
				<div key={index} className='flex items-center gap-3 p-3'>
					<Skeleton variant='circular' width={48} height={48} />
					<div className='flex-1 space-y-2'>
						<Skeleton variant='text' height={16} width='70%' />
						<Skeleton variant='text' height={14} width='50%' />
					</div>
				</div>
			))}
		</div>
	)
}

/**
 * Skeleton para widgets do dashboard
 */
export function WidgetSkeleton() {
	return (
		<div className='bg-white rounded-lg shadow-sm p-6'>
			<div className='flex items-center justify-between mb-4'>
				<Skeleton variant='rectangular' height={24} width='40%' />
				<Skeleton variant='rounded' height={32} width={100} />
			</div>
			<Skeleton variant='text' height={14} width='60%' className='mb-4' />
			<div className='space-y-3'>
				<div className='flex items-center gap-3'>
					<Skeleton variant='circular' width={40} height={40} />
					<div className='flex-1'>
						<Skeleton variant='text' height={16} width='50%' />
						<Skeleton variant='text' height={14} width='30%' />
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<Skeleton variant='circular' width={40} height={40} />
					<div className='flex-1'>
						<Skeleton variant='text' height={16} width='60%' />
						<Skeleton variant='text' height={14} width='40%' />
					</div>
				</div>
			</div>
		</div>
	)
}