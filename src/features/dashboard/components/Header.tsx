'use client'

import {useLocation, useNavigate} from 'react-router'
import bellIcon from '/icons/bell.svg'
import calendarIcon from '/icons/calendar.svg'
import exitIcon from '/icons/exit-right.svg'
import messagesIcon from '/icons/messages.svg'
import {messages} from '../../../mocks/data/messages'
import {notifications} from '../../../mocks/data/notifications'
import {useDetectOutsideClick} from '../../../shared/utils/use-detect-outside-click'
import {MessagesDropdown} from './MessagesDropdown'
import {NotificationsDropdown} from './NotificationsDropdown'

const pageTitles: Record<string, {title: string; description: string}> = {
	'/dashboard': {
		title: 'Visão Geral',
		description: 'Suas tarefas principais estão nessa sessão.'
	},
	'/dashboard/folders/consultation': {
		title: 'Consulta de pastas',
		description: ''
	}
}

export function Header() {
	const navigate = useNavigate()
	const location = useLocation()
	const {
		isActive: showNotifications,
		nodeRef: notificationsRef,
		triggerRef: notificationsTriggerRef
	} = useDetectOutsideClick(false)
	const {
		isActive: showMessages,
		nodeRef: messagesRef,
		triggerRef: messagesTriggerRef
	} = useDetectOutsideClick(false)

	const handleLogout = () => {
		void navigate('/')
	}

	const {title, description} = (pageTitles[location.pathname] ||
		pageTitles['/dashboard']) as {title: string; description: string}

	return (
		<header className='bg-white border-b border-gray-200 px-6 py-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>{title}</h1>
					{description && <p className='text-gray-500 mt-1'>{description}</p>}
				</div>
				<div className='flex items-center space-x-4'>
					<div className='relative' ref={notificationsRef}>
						<button
							className='p-2 text-gray-400 hover:text-gray-600'
							ref={notificationsTriggerRef}
							type='button'
						>
							<img
								alt='Notificações'
								className='w-5 h-5'
								height={20}
								src={bellIcon || '/placeholder.svg'}
								width={20}
							/>
							{notifications.unread > 0 && (
								<span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white' />
							)}
						</button>
						{showNotifications && <NotificationsDropdown />}
					</div>
					<button
						className='p-2 text-gray-400 hover:text-gray-600'
						type='button'
					>
						<img
							alt='Calendário'
							className='w-5 h-5'
							height={20}
							src={calendarIcon || '/placeholder.svg'}
							width={20}
						/>
					</button>
					<div className='relative' ref={messagesRef}>
						<button
							className='p-2 text-gray-400 hover:text-gray-600'
							ref={messagesTriggerRef}
							type='button'
						>
							<img
								alt='mensagens'
								className='w-5 h-5'
								height={20}
								src={messagesIcon || '/placeholder.svg'}
								width={20}
							/>
							{messages.unread > 0 && (
								<span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white' />
							)}
						</button>
						{showMessages && <MessagesDropdown />}
					</div>
					<img
						alt='Avatar do usuário'
						className='w-8 h-8 rounded-full'
						height={32}
						src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription01&hairColor=Blonde&facialHairType=MoustacheMagnum&facialHairColor=Blonde&clotheType=GraphicShirt&clotheColor=Red&graphicType=Skull&eyeType=EyeRoll&eyebrowType=FlatNatural&mouthType=Sad&skinColor=Pale'
						width={32}
					/>
					<button
						className='p-2 text-gray-400 hover:text-gray-600'
						onClick={handleLogout}
						type='button'
					>
						<img
							alt='sair'
							className='w-5 h-5'
							height={20}
							src={exitIcon || '/placeholder.svg'}
							width={20}
						/>
					</button>
				</div>
			</div>
		</header>
	)
}
