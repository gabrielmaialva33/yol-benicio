interface FolderTabsProps {
	filters: {
		status: string
		clientNumber: string
		dateRange: string
		area: string
		search: string
	}
	setFilters: (
		filters:
			| {
					clientNumber: string
					dateRange: string
					area: string
					status: string
					search: string
			  }
			| ((prevFilters: {
					clientNumber: string
					dateRange: string
					area: string
					status: string
					search: string
			  }) => {
					clientNumber: string
					dateRange: string
					area: string
					status: string
					search: string
			  })
	) => void
}

export function FolderTabs({filters, setFilters}: FolderTabsProps) {
	const tabs = [
		{name: 'Total', count: 420},
		{name: 'Pagos', count: 10},
		{name: 'Pendente', count: 8},
		{name: 'Atrasadas', count: 4},
		{name: 'Rascunhos', count: 48}
	]

	const handleTabClick = (tabName: string) => {
		setFilters(prevFilters => ({
			...prevFilters,
			status: tabName
		}))
	}

	if (!filters) {
		return null
	}

	return (
		<div className='border-b border-gray-200'>
			<nav aria-label='Tabs' className='-mb-px flex space-x-8'>
				{tabs.map(tab => (
					<button
						className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
							filters.status === tab.name
								? 'border-orange-500 text-orange-500'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
						key={tab.name}
						onClick={() => handleTabClick(tab.name)}
						type='button'
					>
						{tab.name}
						<span
							className={`ml-2 text-xs font-semibold py-0.5 px-2 rounded-full ${
								filters.status === tab.name
									? 'bg-orange-100 text-orange-600'
									: 'bg-gray-100 text-gray-600'
							}`}
						>
							{tab.count.toString().padStart(2, '0')}
						</span>
					</button>
				))}
			</nav>
		</div>
	)
}
