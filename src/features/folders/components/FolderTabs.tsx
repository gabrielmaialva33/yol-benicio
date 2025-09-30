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

const TABS_LABEL = 'Tabs'
const ACTIVE_BORDER_COLOR = 'border-blue-500 text-blue-600'
const INACTIVE_BORDER_COLOR =
	'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'

const getTextColorClass = (color: string, isActive: boolean): string => {
	if (isActive) {
		return 'text-white'
	}

	const colorMap: Record<string, string> = {
		blue: 'text-white',
		green: 'text-[#118D57]',
		yellow: 'text-[#B76E00]',
		red: 'text-[#B71D18]',
		gray: 'text-[#637381]'
	}

	return colorMap[color] || 'text-gray-600'
}

const getBackgroundColorClass = (color: string, isActive: boolean): string => {
	if (isActive) {
		return 'bg-[#00B8D9]'
	}

	const colorMap: Record<string, string> = {
		blue: 'bg-[#00B8D9]',
		green: 'bg-green-500/16',
		yellow: 'bg-orange-500/16',
		red: 'bg-red-500/16',
		gray: 'bg-gray-500/16'
	}

	return colorMap[color] || 'bg-gray-200'
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
			<nav aria-label={TABS_LABEL} className='-mb-px flex space-x-8'>
				{tabs.map(tab => {
					const isActive = filters.status === tab.name
					const borderClass = isActive
						? ACTIVE_BORDER_COLOR
						: INACTIVE_BORDER_COLOR
					const bgClass = getBackgroundColorClass(tab.color, isActive)
					const textClass = getTextColorClass(tab.color, isActive)

					return (
						<button
							className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${borderClass}`}
							key={tab.name}
							onClick={() => handleTabClick(tab.name)}
							type='button'
						>
							{tab.name}
							<span
								className={`ml-2 text-xs font-semibold py-1 px-2.5 rounded-full ${bgClass} ${textClass}`}
							>
								{tab.count.toString().padStart(2, '0')}
							</span>
						</button>
					)
				})}
			</nav>
		</div>
	)
}
