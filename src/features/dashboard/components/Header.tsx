'use client'

import {useLocation, useNavigate} from 'react-router'
import bellIcon from '/icons/bell.svg'
import calendarIcon from '/icons/calendar.svg'
import exitIcon from '/icons/exit-right.svg'
import messagesIcon from '/icons/messages.svg'
import {messages} from '../../../mocks/data/messages'
import {notifications} from '../../../mocks/data/notifications'
import {Breadcrumb} from '../../../shared/components/Breadcrumb'
import {useDetectOutsideClick} from '../../../shared/utils/use-detect-outside-click'
import {MessagesDropdown} from './MessagesDropdown'
import {NotificationsDropdown} from './NotificationsDropdown'

const pageTitles: Record<string, {title: string; description: string}> = {
	'/dashboard': {
		title: 'Visão Geral',
		description: 'Suas tarefas principais estão nessa seção.'
	},
	'/dashboard/folders/consultation': {
		title: 'Consulta de pastas',
		description: ''
	},
	'/dashboard/folders/register': {
		title: 'Cadastro de Pasta',
		description: 'Preencha os dados do novo processo'
	}
}

interface HeaderActionsProps {
	onLogout: () => void
}

function NotificationButton() {
	const {
		isActive: showNotifications,
		nodeRef: notificationsRef,
		triggerRef: notificationsTriggerRef
	} = useDetectOutsideClick(false)

	return (
		<div className='relative' ref={notificationsRef}>
			<button
				aria-label='Notificações'
				className='w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition'
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
					<span className='absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#F1F1F2]' />
				)}
			</button>
			{showNotifications && <NotificationsDropdown />}
		</div>
	)
}

function MessagesButton() {
	const {
		isActive: showMessages,
		nodeRef: messagesRef,
		triggerRef: messagesTriggerRef
	} = useDetectOutsideClick(false)

	return (
		<div className='relative' ref={messagesRef}>
			<button
				aria-label='Mensagens'
				className='w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition'
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
					<span className='absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#F1F1F2]' />
				)}
			</button>
			{showMessages && <MessagesDropdown />}
		</div>
	)
}

function HeaderActions({onLogout}: HeaderActionsProps) {
	return (
		<div className='flex items-center space-x-6'>
			<NotificationButton />
			<button
				aria-label='Calendário'
				className='w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition'
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
			<MessagesButton />
			<img
				alt='Avatar do usuário'
				className='w-9 h-9 rounded-lg object-cover'
				height={36}
				src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription01&hairColor=Blonde&facialHairType=MoustacheMagnum&facialHairColor=Blonde&clotheType=GraphicShirt&clotheColor=Red&graphicType=Skull&eyeType=EyeRoll&eyebrowType=FlatNatural&mouthType=Sad&skinColor=Pale'
				width={36}
			/>
			<button
				aria-label='Sair'
				className='w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition'
				onClick={onLogout}
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
	)
}

function getBreadcrumbsForPath(pathname: string) {
	switch (pathname) {
		case '/dashboard/folders/consultation':
			return [
				{label: 'Pastas', href: '/dashboard/folders'},
				{label: 'Consulta', isActive: true}
			]
		case '/dashboard/folders/register':
			return [
				{label: 'Pastas', href: '/dashboard/folders'},
				{label: 'Cadastrar', isActive: true}
			]
		default:
			return []
	}
}

export function Header() {
	const navigate = useNavigate()
	const location = useLocation()

	const handleLogout = () => {
		void navigate('/')
	}

	const {title, description} = (pageTitles[location.pathname] ||
		pageTitles['/dashboard']) as {title: string; description: string}

	const breadcrumbs = getBreadcrumbsForPath(location.pathname)

	return (
		<header className='bg-[#F1F1F2] border-b border-gray-200 px-[30px] py-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-[#161C24]'>{title}</h1>
					{description && <p className='text-gray-500 mt-1'>{description}</p>}
					{breadcrumbs.length > 0 && (
						<div className='mt-2'>
							<Breadcrumb items={breadcrumbs} />
						</div>
					)}
				</div>
				<HeaderActions onLogout={handleLogout} />
			</div>
		</header>
	)
}
