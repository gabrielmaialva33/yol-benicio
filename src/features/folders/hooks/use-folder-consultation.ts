import {useEffect, useState} from 'react'
import type {QueryParams} from '../../../shared/types/api'
import {useFolderConsultation as useFolderConsultationApi} from './use-folders-api'

const DEBOUNCE_DELAY = 300

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
	const [debouncedFilters, setDebouncedFilters] = useState(filters)
	const [sort, setSort] = useState({
		column: 'created_at',
		direction: 'desc'
	})

	// Debounce filters to avoid excessive API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedFilters(filters)
		}, DEBOUNCE_DELAY)

		return () => clearTimeout(timer)
	}, [
		filters.clientNumber,
		filters.dateRange,
		filters.area,
		filters.status,
		filters.search,
		filters
	])

	// Convert filters to API standard
	const queryParams: QueryParams = {
		page,
		per_page: limit,
		sort_by: sort.column,
		order: sort.direction as 'asc' | 'desc',
		...(debouncedFilters.search && {search: debouncedFilters.search}),
		...(debouncedFilters.clientNumber && {
			client_number: debouncedFilters.clientNumber
		}),
		...(debouncedFilters.area &&
			debouncedFilters.area !== 'Total' && {area: debouncedFilters.area}),
		...(debouncedFilters.status &&
			debouncedFilters.status !== 'Total' && {status: debouncedFilters.status}),
		...(debouncedFilters.dateRange &&
			parseDateRange(debouncedFilters.dateRange))
	}

	const {data, isLoading, isError, isRefetching, isInitialLoading} = useFolderConsultationApi(queryParams)

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
		isInitialLoading,
		isRefetching,
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
