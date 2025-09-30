import {mockTimelineEvents} from './timeline/mockData'
import {TimelineEvent} from './timeline/TimelineEvent'

interface ProcessTimelineProps {
	folderId: string
}

export function ProcessTimeline({folderId: _folderId}: ProcessTimelineProps) {
	const events = mockTimelineEvents // In real app, fetch based on folderId

	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
			{/* Header with Search */}
			<div className='px-6 py-4 border-b border-gray-100'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-semibold text-gray-900'>
						{/* Histórico */}
					</h2>
					<div className='relative w-64'>
						<input
							className='w-full pl-4 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]'
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
					<div className='absolute left-8 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-300' />

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
