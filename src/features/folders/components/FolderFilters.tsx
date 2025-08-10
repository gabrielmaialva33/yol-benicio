import type React from 'react'

interface FolderFiltersProps {
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
}

export function FolderFilters({filters, setFilters}: FolderFiltersProps) {
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const {name, value} = e.target
		setFilters({
			...filters,
			[name]: value
		})
	}

	return (
		<div className='p-4 bg-white rounded-lg'>
			<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
				<input
					className='p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500'
					name='clientNumber'
					onChange={handleInputChange}
					placeholder='N° Cliente'
					type='text'
					value={filters.clientNumber}
				/>
				<input
					className='p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500'
					name='dateRange'
					onChange={handleInputChange}
					placeholder='Data de inclusão'
					type='text'
					value={filters.dateRange}
				/>
				<select
					className='p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500'
					name='area'
					onChange={handleInputChange}
					value={filters.area}
				>
					<option value=''>Todas as Áreas</option>
					<option value='Civel contencioso'>Civel contencioso</option>
				</select>
				<input
					className='p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500'
					name='search'
					onChange={handleInputChange}
					placeholder='Buscar'
					type='text'
					value={filters.search}
				/>
				<button
					className='px-4 py-2 text-sm font-semibold text-red-500 border border-red-500 rounded-md hover:bg-red-50'
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
					Limpar
				</button>
			</div>
		</div>
	)
}
