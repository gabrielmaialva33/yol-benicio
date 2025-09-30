import {Calendar, ChevronDown, Search} from 'lucide-react'
import type React from 'react'

const AREA_OPTIONS = {
	DEFAULT: 'Área',
	CIVIL: 'Cível contencioso',
	LABOR: 'Trabalhista',
	CRIMINAL: 'Penal',
	BUSINESS: 'Empresarial',
	TAX: 'Tributário',
	FAMILY: 'Família',
	CONSUMER: 'Consumidor',
	ENVIRONMENTAL: 'Ambiental'
} as const

const CLIENT_NUMBER_PLACEHOLDER = 'N° Cliente'
const DATE_PLACEHOLDER = 'DD/MM/AAAA'
const SEARCH_PLACEHOLDER = 'Buscar'

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

function _ClientNumberInput({
	value,
	onChange
}: {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
	return (
		<input
			className='rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 text-sm placeholder-gray-500 transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
			name='clientNumber'
			onChange={onChange}
			placeholder={CLIENT_NUMBER_PLACEHOLDER}
			type='text'
			value={value}
		/>
	)
}

function _DateRangeInput({
	value,
	onChange
}: {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
	return (
		<div className='relative'>
			<input
				className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 text-sm placeholder-gray-500 transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
				maxLength={10}
				name='dateRange'
				onChange={onChange}
				placeholder={DATE_PLACEHOLDER}
				type='text'
				value={value}
			/>
			<Calendar className='-translate-y-1/2 absolute top-1/2 right-4 h-4 w-4 transform text-gray-400' />
		</div>
	)
}

function _AreaSelect({
	value,
	onChange
}: {
	value: string
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
	return (
		<div className='relative'>
			<select
				className='w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 text-sm transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
				name='area'
				onChange={onChange}
				value={value}
			>
				<option value=''>{AREA_OPTIONS.DEFAULT}</option>
				<option value={AREA_OPTIONS.CIVIL}>{AREA_OPTIONS.CIVIL}</option>
				<option value={AREA_OPTIONS.LABOR}>{AREA_OPTIONS.LABOR}</option>
				<option value={AREA_OPTIONS.CRIMINAL}>{AREA_OPTIONS.CRIMINAL}</option>
				<option value={AREA_OPTIONS.BUSINESS}>{AREA_OPTIONS.BUSINESS}</option>
				<option value={AREA_OPTIONS.TAX}>{AREA_OPTIONS.TAX}</option>
				<option value={AREA_OPTIONS.FAMILY}>{AREA_OPTIONS.FAMILY}</option>
				<option value={AREA_OPTIONS.CONSUMER}>{AREA_OPTIONS.CONSUMER}</option>
				<option value={AREA_OPTIONS.ENVIRONMENTAL}>
					{AREA_OPTIONS.ENVIRONMENTAL}
				</option>
			</select>
			<ChevronDown className='-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-4 w-4 transform text-gray-400' />
		</div>
	)
}

function _SearchInput({
	value,
	onChange,
	isLoading
}: {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	isLoading?: boolean | undefined
}) {
	return (
		<div className='relative sm:col-span-2 lg:col-span-1'>
			{isLoading ? (
				<div className='-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 transform'>
					<div className='h-4 w-4 animate-spin rounded-full border-[#00B8D9] border-b-2' />
				</div>
			) : (
				<Search className='-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 transform text-gray-400' />
			)}
			<input
				className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-12 text-gray-900 text-sm placeholder-gray-500 transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
				name='search'
				onChange={onChange}
				placeholder={SEARCH_PLACEHOLDER}
				type='text'
				value={value}
			/>
		</div>
	)
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
		const DayLength = 2
		const MonthPosition = 5
		const StartYearPosition = 5
		const EndYearPosition = 9

		let value = e.target.value.replace(/\D/g, '')

		if (value.length >= DayLength) {
			value = `${value.slice(0, DayLength)}/${value.slice(DayLength)}`
		}
		if (value.length >= MonthPosition) {
			value = `${value.slice(0, MonthPosition)}/${value.slice(StartYearPosition, EndYearPosition)}`
		}

		setFilters({
			...filters,
			dateRange: value
		})
	}

	return (
		<div className='px-4 py-6 sm:px-6'>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
				<_ClientNumberInput
					onChange={handleInputChange}
					value={filters.clientNumber}
				/>
				<_DateRangeInput
					onChange={handleDateChange}
					value={filters.dateRange}
				/>
				<_AreaSelect onChange={handleInputChange} value={filters.area} />
				<_SearchInput
					isLoading={isLoading}
					onChange={handleInputChange}
					value={filters.search}
				/>
			</div>
		</div>
	)
}
