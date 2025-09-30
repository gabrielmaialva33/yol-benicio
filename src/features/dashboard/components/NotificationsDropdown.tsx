import {DateTime} from 'luxon'
import {notifications} from '../../../mocks/data/notifications'

const NOTIFICATIONS_TITLE = 'Notificações'
const VIEW_ALL_NOTIFICATIONS = 'Ver todas as notificações'

export function NotificationsDropdown() {
	return (
		<div className='absolute top-12 right-0 w-80 bg-gray-50 rounded-lg shadow-lg border border-gray-200 z-10'>
			<div className='p-4 border-b'>
				<h3 className='font-semibold text-gray-800'>{NOTIFICATIONS_TITLE}</h3>
			</div>
			<div className='divide-y'>
				{notifications.items.map(item => (
					<div className='p-4 flex items-start space-x-4' key={item.id}>
						<img
							alt='Avatar'
							className='w-10 h-10 rounded-full'
							height={40}
							src={item.avatar}
							width={40}
						/>
						<div>
							<p className='text-sm text-gray-800'>{item.title}</p>
							<p className='text-xs text-gray-500'>
								{DateTime.fromJSDate(item.time).toRelative()}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className='p-2 text-center border-t'>
				<button className='text-sm text-blue-600 hover:underline' type='button'>
					{VIEW_ALL_NOTIFICATIONS}
				</button>
			</div>
		</div>
	)
}
