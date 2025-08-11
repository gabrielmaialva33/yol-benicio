import {Outlet} from 'react-router'
import {Header} from './components/Header'
import {Sidebar} from './components/Sidebar'

const Dashboard = () => {
	return (
		<div className='flex h-screen bg-[#F8FAFC]'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Header />
				<main className='flex-1 overflow-y-auto'>
					<div className='max-w-[1480px] mx-auto px-8 pb-8'>
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	)
}

export {Dashboard}
