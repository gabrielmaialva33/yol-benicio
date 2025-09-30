import {AlertCircle, Bell, CheckCircle, X} from 'lucide-react'
import type {TimelineEventData} from './types'

const getStatusIcon = (status?: string) => {
	switch (status) {
		case 'success':
			return CheckCircle
		case 'warning':
			return AlertCircle
		case 'error':
			return X
		case 'info':
			return Bell
		default:
			return null
	}
}

const getStatusColors = (status?: string) => {
	switch (status) {
		case 'success':
			return {
				bg: 'bg-green-50',
				border: 'border-green-200',
				text: 'text-green-900',
				subtext: 'text-green-700',
				button: 'bg-green-600 hover:bg-green-700',
				iconBg: 'bg-green-100',
				iconColor: 'text-green-600'
			}
		case 'warning':
			return {
				bg: 'bg-amber-50',
				border: 'border-amber-200',
				text: 'text-amber-900',
				subtext: 'text-amber-700',
				button: 'bg-amber-600 hover:bg-amber-700',
				iconBg: 'bg-amber-100',
				iconColor: 'text-amber-600'
			}
		case 'error':
			return {
				bg: 'bg-red-50',
				border: 'border-red-200',
				text: 'text-red-900',
				subtext: 'text-red-700',
				button: 'bg-red-600 hover:bg-red-700',
				iconBg: 'bg-red-100',
				iconColor: 'text-red-600'
			}
		default:
			return null
	}
}

interface TimelineEventCardProps {
	event: TimelineEventData
}

export function TimelineEventCard({event}: TimelineEventCardProps) {
	const statusColors = getStatusColors(event.status)
	const StatusIcon = getStatusIcon(event.status)

	// Status cards with actions
	if (statusColors && event.actionText) {
		return (
			<div
				className={`mt-3 rounded-lg ${statusColors.bg} border ${statusColors.border} p-4`}
			>
				<div className='flex items-start gap-3'>
					{StatusIcon && (
						<div
							className={`flex h-8 w-8 items-center justify-center rounded-full ${statusColors.iconBg}`}
						>
							<StatusIcon className={`h-5 w-5 ${statusColors.iconColor}`} />
						</div>
					)}
					<div className='flex-1'>
						<p className={`text-sm font-medium ${statusColors.text}`}>
							{event.actionText}
						</p>
						{event.actionDescription && (
							<p className={`mt-1 text-xs ${statusColors.subtext}`}>
								{event.actionDescription}
							</p>
						)}
					</div>
					{event.status === 'success' && (
						<button
							className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors ${statusColors.button}`}
							type='button'
						>
							{/* Continuar */}
						</button>
					)}
					{event.status === 'error' && (
						<button
							className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors ${statusColors.button}`}
							type='button'
						>
							{/* Resolver */}
						</button>
					)}
				</div>
			</div>
		)
	}

	// Categories and Action
	if (event.category && !statusColors) {
		return (
			<div className='mt-3 rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors'>
				<div className='flex items-center justify-between'>
					<div className='flex-1'>
						<p className='text-sm font-medium text-gray-900 mb-2'>
							{event.description}
						</p>
						<div className='flex flex-wrap gap-2'>
							{event.category.map(cat => {
								const isPositive = cat.toLowerCase().includes('favorável')
								const isWarning =
									cat.toLowerCase().includes('audiência') ||
									cat.toLowerCase().includes('agendada')

								let badgeClasses = 'bg-gray-100 text-gray-700'
								if (isPositive) {
									badgeClasses = 'bg-green-100 text-green-700'
								} else if (isWarning) {
									badgeClasses = 'bg-amber-100 text-amber-700'
								}

								return (
									<span
										className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses}`}
										key={cat}
									>
										{cat}
									</span>
								)
							})}
						</div>
					</div>
					<button
						className='rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors'
						type='button'
					>
						{/* Visualizar */}
					</button>
				</div>
			</div>
		)
	}

	return null
}
