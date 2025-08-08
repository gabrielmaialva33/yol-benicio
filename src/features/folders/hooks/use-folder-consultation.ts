import {useState} from 'react'
import type {QueryParams} from '../../../shared/types/api'
import {useFolderConsultation as useFolderConsultationApi} from './use-folders-api'

export function useFolderConsultation() {
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [filters, setFilters] = useState({
		clientNumber: '',
		dateRange: '',
		area: '',
		status: 'Total',
		search: ''
	})
	const [sort, setSort] = useState({
		column: 'created_at',
		direction: 'desc'
	})

	// Convert filters to API standard
	const queryParams: QueryParams = {
		page,
		per_page: limit,
		sort_by: sort.column,
		order: sort.direction as 'asc' | 'desc',
		...(filters.search && {search: filters.search}),
		...(filters.clientNumber && {client_number: filters.clientNumber}),
		...(filters.area && filters.area !== 'Total' && {area: filters.area}),
		...(filters.status &&
			filters.status !== 'Total' && {status: filters.status}),
		...(filters.dateRange && parseDateRange(filters.dateRange))
	}

	const {data, isLoading, isError} = useFolderConsultationApi(queryParams)

	return {
		folders: data?.data ?? [],
		pagination: {
			page: data?.meta.current_page ?? 1,
			limit: data?.meta.per_page ?? 10,
			total: data?.meta.total ?? 0,
			totalPages: data?.meta.last_page ?? 1
		},
		filters,
		setFilters,
		sort,
		setSort,
		isLoading,
		isError,
		setPage,
		setLimit
	}
}

function parseDateRange(dateRange: string) {
	const [startDate, endDate] = dateRange.split(' to ')
	return {
		...(startDate && {date_from: startDate.trim()}),
		...(endDate && {date_to: endDate.trim()})
	}
}
