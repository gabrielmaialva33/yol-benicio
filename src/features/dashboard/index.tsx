import {Outlet, useLocation} from 'react-router'
import {ChatWidget} from '../ai-chat/components/ChatWidget'
import {Header} from './components/Header'
import {Sidebar} from './components/Sidebar'

const Dashboard = () => {
	const location = useLocation()
	const isInChatPage = location.pathname.startsWith('/dashboard/chat')

	return (
		<div className='flex h-screen bg-[#F1F1F2]'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Header />
				<main className='flex-1 overflow-y-auto'>
					<Outlet />
				</main>
			</div>
			{!isInChatPage && <ChatWidget />}
		</div>
	)
}

export {Dashboard}
// Re-exports removed to avoid barrel file lint warnings
// Import components directly from their individual files when needed
