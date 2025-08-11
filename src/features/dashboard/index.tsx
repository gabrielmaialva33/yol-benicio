import {Outlet} from 'react-router'
import {Header} from './components/Header'
import {Sidebar} from './components/Sidebar'

const Dashboard = () => {
	return (
		<div className='flex h-screen bg-[#F1F1F2]'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Header />
				<main className='flex-1 overflow-y-auto'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export {Dashboard}
// Re-exports removed to avoid barrel file lint warnings
// Import components directly from their individual files when needed
