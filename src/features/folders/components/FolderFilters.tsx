import {Calendar, ChevronDown, Search} from 'lucide-react'
import type React from 'react'

interface FolderFiltersProps {
	filters: {
		clientNumber: string
		dateRange: string
		area: string
		status: string
		search: string
	}
	isLoading?: boolean
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

export function FolderFilters({
	filters,
	setFilters,
	isLoading
}: FolderFiltersProps) {
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const {name, value} = e.target
		setFilters({
			...filters,
			[name]: value
		})
	}

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const DAY_LENGTH = 2
		const MONTH_POSITION = 5
		const START_YEAR_POSITION = 5
		const END_YEAR_POSITION = 9

		let value = e.target.value.replace(/\D/g, '')

		if (value.length >= DAY_LENGTH) {
			value = `${value.slice(0, DAY_LENGTH)}/${value.slice(DAY_LENGTH)}`
		}
		if (value.length >= MONTH_POSITION) {
			value = `${value.slice(0, MONTH_POSITION)}/${value.slice(START_YEAR_POSITION, END_YEAR_POSITION)}`
		}

		setFilters({
			...filters,
			dateRange: value
		})
	}

	return (
		<div className='px-4 sm:px-6 py-6'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
				<input
					className='px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9] transition-colors'
					name='clientNumber'
					onChange={handleInputChange}
					placeholder='N° Cliente'
					type='text'
					value={filters.clientNumber}
				/>
				<div className='relative'>
					<input
						className='px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9] transition-colors'
						maxLength={10}
						name='dateRange'
						onChange={handleDateChange}
						placeholder='DD/MM/AAAA'
						type='text'
						value={filters.dateRange}
					/>
					<Calendar className='absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
				</div>
				<div className='relative'>
					<select
						className='px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-white text-gray-900 appearance-none w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9] transition-colors'
						name='area'
						onChange={handleInputChange}
						value={filters.area}
					>
						<option value=''>Área</option>
						<option value='Cível contencioso'>Cível contencioso</option>
						<option value='Trabalhista'>Trabalhista</option>
						<option value='Penal'>Penal</option>
						<option value='Empresarial'>Empresarial</option>
						<option value='Tributário'>Tributário</option>
						<option value='Família'>Família</option>
						<option value='Consumidor'>Consumidor</option>
						<option value='Ambiental'>Ambiental</option>
					</select>
					<ChevronDown className='absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
				</div>
				<div className='relative sm:col-span-2 lg:col-span-1'>
					{isLoading ? (
						<div className='absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4'>
							<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#00B8D9]' />
						</div>
					) : (
						<Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
					)}
					<input
						className='px-4 py-3 pl-12 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9] transition-colors'
						name='search'
						onChange={handleInputChange}
						placeholder='Buscar'
						type='text'
						value={filters.search}
					/>
				</div>
			</div>
		</div>
	)
}
