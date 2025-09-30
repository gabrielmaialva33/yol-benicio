import {DateTime} from 'luxon'
import {TimelineEventCard} from './TimelineEventCard'
import {TimelineEventDocuments} from './TimelineEventDocuments'
import type {TimelineEventData} from './types'
import {getEventConfig} from './utils'

interface TimelineEventProps {
	event: TimelineEventData
}

export function TimelineEvent({event}: TimelineEventProps) {
	const config = getEventConfig(event.eventType)
	const Icon = config.icon
	const eventDate = DateTime.fromISO(event.date)

	return (
		<div className='flex gap-4'>
			{/* Icon */}
			<div
				className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${config.iconBg} border-2 ${config.borderColor}`}
			>
				<Icon className={`h-6 w-6 ${config.iconColor}`} />
			</div>

			{/* Content */}
			<div className='flex-1 pb-6'>
				{/* Title and Reference */}
				<div className='flex items-start justify-between'>
					<div>
						<div className='flex items-center gap-2'>
							<h4 className='text-base font-medium text-gray-900'>
								{event.title}
							</h4>
							{event.referenceNumber && (
								<span className='text-sm text-cyan-600'>
									{event.referenceNumber}
								</span>
							)}
						</div>

						{/* Added by info */}
						<div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
							<span>{eventDate.toFormat('dd/MM/yyyy')}</span>
							<div className='flex items-center gap-1'>
								<img
									alt={event.addedBy.name}
									className='h-5 w-5 rounded-full'
									height={20}
									src={
										event.addedBy.avatar ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(event.addedBy.name)}`
									}
									width={20}
								/>
							</div>
						</div>
					</div>
				</div>

				<TimelineEventCard event={event} />
				<TimelineEventDocuments documents={event.documents} />
			</div>
		</div>
	)
}
