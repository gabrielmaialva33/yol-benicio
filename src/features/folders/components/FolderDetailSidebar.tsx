import {Search} from 'lucide-react'

const menuItems = [
	{name: 'Processo', id: 'processo'},
	{name: 'Andamento', id: 'andamento'},
	{name: 'Informações Gerais', id: 'informacoes'},
	{name: 'Publicações', id: 'publicacoes'},
	{name: 'Agenda', id: 'agenda'},
	{name: 'Instância', id: 'instancia'},
	{name: 'Verbas', id: 'verbas'},
	{name: 'Garantias', id: 'garantias'},
	{name: 'Desdobramento', id: 'desdobramento'},
	{name: 'Honorários', id: 'honorarios'}
]

interface FolderDetailSidebarProps {
	activeTab: string
	onTabChange: (tabId: string) => void
}

export function FolderDetailSidebar({
	activeTab,
	onTabChange
}: FolderDetailSidebarProps) {
	return (
		<div className='w-72 bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
			<div className='relative mb-6'>
				<Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
				<input
					className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9] transition-colors'
					placeholder='Buscar'
					type='text'
				/>
			</div>
			<nav>
				<ul className='space-y-1'>
					{menuItems.map(item => (
						<li key={item.id}>
							<button
								className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
									activeTab === item.id
										? 'bg-[#00B8D9] text-white shadow-sm'
										: 'text-[#161C24] hover:bg-gray-50 hover:text-[#161C24]'
								}`}
								onClick={() => onTabChange(item.id)}
								type='button'
							>
								{item.name}
							</button>
						</li>
					))}
				</ul>
			</nav>
		</div>
	)
}
