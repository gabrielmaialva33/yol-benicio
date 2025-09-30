import {mockTimelineEvents} from './timeline/mockData'
import {TimelineEvent} from './timeline/TimelineEvent'

interface ProcessTimelineProps {
	folderId: string
}

export function ProcessTimeline({folderId: _folderId}: ProcessTimelineProps) {
	const events = mockTimelineEvents // In real app, fetch based on folderId

	return (
		<div className='rounded-2xl border border-gray-100 bg-white shadow-sm'>
			{/* Header with Search */}
			<div className='border-gray-100 border-b px-6 py-4'>
				<div className='flex items-center justify-between'>
					<h2 className='font-semibold text-gray-900 text-lg'>
						{/* Histórico */}
					</h2>
					<div className='relative w-64'>
						<input
							className='w-full rounded-lg border border-gray-300 py-2 pr-4 pl-4 text-sm focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
							placeholder=''
							type='text'
						/>
					</div>
				</div>
			</div>

			{/* Timeline */}
			<div className='p-6'>
				<div className='relative'>
					{/* Vertical line */}
					<div className='absolute top-0 bottom-0 left-8 w-px border-gray-300 border-l-2 border-dashed' />

					{/* Events */}
					<div className='space-y-6'>
						{events.map(event => (
							<TimelineEvent event={event} key={event.id} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
