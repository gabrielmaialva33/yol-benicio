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
				className='flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/60 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300'
				ref={notificationsTriggerRef}
				type='button'
			>
				<img
					alt='Notificações'
					className='h-5 w-5'
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
				className='flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/60 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300'
				ref={messagesTriggerRef}
				type='button'
			>
				<img
					alt='mensagens'
					className='h-5 w-5'
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
				className='flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/60 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300'
				type='button'
			>
				<img
					alt='Calendário'
					className='h-5 w-5'
					height={20}
					src={calendarIcon || '/placeholder.svg'}
					width={20}
				/>
			</button>
			<MessagesButton />
			<img
				alt='Avatar do usuário'
				className='h-9 w-9 rounded-lg object-cover'
				height={36}
				src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription01&hairColor=Blonde&facialHairType=MoustacheMagnum&facialHairColor=Blonde&clotheType=GraphicShirt&clotheColor=Red&graphicType=Skull&eyeType=EyeRoll&eyebrowType=FlatNatural&mouthType=Sad&skinColor=Pale'
				width={36}
			/>
			<button
				aria-label='Sair'
				className='flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/60 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300'
				onClick={onLogout}
				type='button'
			>
				<img
					alt='sair'
					className='h-5 w-5'
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
		<header className='border-gray-200 border-b bg-[#F1F1F2] px-[30px] py-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='font-semibold text-2xl text-[#161C24]'>{title}</h1>
					{description && <p className='mt-1 text-gray-500'>{description}</p>}
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
