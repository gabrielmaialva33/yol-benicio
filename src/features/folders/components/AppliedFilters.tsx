import {X} from 'lucide-react'

interface AppliedFiltersProps {
	filters: {
		clientNumber: string
		dateRange: string
		area: string
		status: string
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
	resultCount: number
}

export function AppliedFilters({
	filters,
	setFilters,
	resultCount
}: AppliedFiltersProps) {
	const appliedFilters: Array<{key: string; label: string; value: string}> = []

	if (filters.area && filters.area !== '') {
		appliedFilters.push({
			key: 'area',
			label: `Área responsável: ${filters.area}`,
			value: filters.area
		})
	}

	if (filters.clientNumber && filters.clientNumber !== '') {
		appliedFilters.push({
			key: 'clientNumber',
			label: `Cliente: ${filters.clientNumber}`,
			value: filters.clientNumber
		})
	}

	if (filters.search && filters.search !== '') {
		appliedFilters.push({
			key: 'search',
			label: `Busca: ${filters.search}`,
			value: filters.search
		})
	}

	const removeFilter = (key: string) => {
		setFilters(prevFilters => ({
			...prevFilters,
			[key]: ''
		}))
	}

	const hasAppliedFilters = appliedFilters.length > 0

	if (!hasAppliedFilters) {
		return null
	}

	return (
		<div className='px-6 py-3 bg-white border-b'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<span className='text-sm text-gray-600'>
						{resultCount} resultados encontrados
					</span>
					<div className='flex items-center space-x-2'>
						{appliedFilters.map(filter => (
							<div
								className='inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700'
								key={filter.key}
							>
								{filter.label}
								<button
									className='ml-2 text-red-500 hover:text-red-700'
									onClick={() => removeFilter(filter.key)}
									type='button'
								>
									<X className='w-3 h-3' />
								</button>
							</div>
						))}
						<button
							className='text-xs font-medium text-red-500 hover:text-red-700 flex items-center'
							onClick={() =>
								setFilters({
									clientNumber: '',
									dateRange: '',
									area: '',
									status: 'Total',
									search: ''
								})
							}
							type='button'
						>
							<X className='w-3 h-3 mr-1' />
							Limpar
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
