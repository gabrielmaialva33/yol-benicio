import {DateTime} from 'luxon'
import {messages} from '../../../mocks/data/messages'

const MESSAGES_TITLE = 'Mensagens'
const VIEW_ALL_MESSAGES = 'Ver todas as mensagens'

export function MessagesDropdown() {
	return (
		<div className='absolute top-12 right-0 w-80 bg-gray-50 rounded-lg shadow-lg border border-gray-200 z-10'>
			<div className='p-4 border-b'>
				<h3 className='font-semibold text-gray-800'>{MESSAGES_TITLE}</h3>
			</div>
			<div className='divide-y'>
				{messages.items.map(item => (
					<div className='p-4 flex items-start space-x-4' key={item.id}>
						<img
							alt='Avatar'
							className='w-10 h-10 rounded-full'
							height={40}
							src={item.avatar}
							width={40}
						/>
						<div>
							<p className='text-sm font-semibold text-gray-800'>{item.name}</p>
							<p className='text-sm text-gray-800'>{item.message}</p>
							<p className='text-xs text-gray-500'>
								{DateTime.fromJSDate(item.time).toRelative()}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className='p-2 text-center border-t'>
				<button className='text-sm text-blue-600 hover:underline' type='button'>
					{VIEW_ALL_MESSAGES}
				</button>
			</div>
		</div>
	)
}
