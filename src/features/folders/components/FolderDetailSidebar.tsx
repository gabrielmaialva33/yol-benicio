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
		<div className='w-72 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
			<div className='relative mb-6'>
				<Search className='-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 text-gray-400' />
				<input
					className='w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 text-sm transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
					placeholder='Buscar'
					type='text'
				/>
			</div>
			<nav>
				<ul className='space-y-1'>
					{menuItems.map(item => (
						<li key={item.id}>
							<button
								className={`block w-full rounded-lg px-4 py-3 text-left font-medium text-sm transition-colors ${
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
