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
		{name: 'Total', count: 150, color: 'blue'},
		{name: 'Ativo', count: 65, color: 'green'},
		{name: 'Pendente', count: 35, color: 'yellow'},
		{name: 'Concluído', count: 30, color: 'green'},
		{name: 'Cancelado', count: 12, color: 'red'},
		{name: 'Arquivado', count: 8, color: 'gray'}
	]

	const getColorClasses = (color: string, isActive: boolean) => {
		if (isActive) {
			switch (color) {
				case 'blue':
					return 'text-white'
				case 'green':
					return 'text-white'
				case 'yellow':
					return 'text-white'
				case 'red':
					return 'text-white'
				case 'gray':
					return 'text-white'
				default:
					return 'text-white'
			}
		}
		switch (color) {
			case 'blue':
				return 'text-white'
			case 'green':
				return 'text-[#118D57]'
			case 'yellow':
				return 'text-[#B76E00]'
			case 'red':
				return 'text-[#B71D18]'
			case 'gray':
				return 'text-[#637381]'
			default:
				return 'text-gray-600'
		}
	}

	const getBgColorClasses = (color: string, isActive: boolean) => {
		if (isActive) {
			switch (color) {
				case 'blue':
					return 'bg-[#00B8D9]'
				case 'green':
					return 'bg-[#00B8D9]'
				case 'yellow':
					return 'bg-[#00B8D9]'
				case 'red':
					return 'bg-[#00B8D9]'
				case 'gray':
					return 'bg-[#00B8D9]'
				default:
					return 'bg-[#00B8D9]'
			}
		}
		switch (color) {
			case 'blue':
				return 'bg-[#00B8D9]'
			case 'green':
				return 'bg-green-500/16'
			case 'yellow':
				return 'bg-orange-500/16'
			case 'red':
				return 'bg-red-500/16'
			case 'gray':
				return 'bg-gray-500/16'
			default:
				return 'bg-gray-200'
		}
	}

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
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
						key={tab.name}
						onClick={() => handleTabClick(tab.name)}
						type='button'
					>
						{tab.name}
						<span
							className={`ml-2 text-xs font-semibold py-1 px-2.5 rounded-full ${getBgColorClasses(
								tab.color,
								filters.status === tab.name
							)} ${getColorClasses(tab.color, filters.status === tab.name)}`}
						>
							{tab.count.toString().padStart(2, '0')}
						</span>
					</button>
				))}
			</nav>
		</div>
	)
}
