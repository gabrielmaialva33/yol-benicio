import {DateTime} from 'luxon'
import {notifications} from '../../../mocks/data/notifications'

const NOTIFICATIONS_TITLE = 'Notificações'
const VIEW_ALL_NOTIFICATIONS = 'Ver todas as notificações'

export function NotificationsDropdown() {
	return (
		<div className='absolute top-12 right-0 z-10 w-80 rounded-lg border border-gray-200 bg-gray-50 shadow-lg'>
			<div className='border-b p-4'>
				<h3 className='font-semibold text-gray-800'>{NOTIFICATIONS_TITLE}</h3>
			</div>
			<div className='divide-y'>
				{notifications.items.map(item => (
					<div className='flex items-start space-x-4 p-4' key={item.id}>
						<img
							alt='Avatar'
							className='h-10 w-10 rounded-full'
							height={40}
							src={item.avatar}
							width={40}
						/>
						<div>
							<p className='text-gray-800 text-sm'>{item.title}</p>
							<p className='text-gray-500 text-xs'>
								{DateTime.fromJSDate(item.time).toRelative()}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className='border-t p-2 text-center'>
				<button className='text-blue-600 text-sm hover:underline' type='button'>
					{VIEW_ALL_NOTIFICATIONS}
				</button>
			</div>
		</div>
	)
}
