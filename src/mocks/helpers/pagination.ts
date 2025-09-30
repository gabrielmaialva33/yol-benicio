import type {PaginatedResponse, PaginationMeta} from '../../shared/types/api'

interface CreatePaginatedResponseOptions<T> {
	data: T[]
	page: number
	perPage: number
	baseUrl: string
}

export function createPaginatedResponse<T>({
	data,
	page,
	perPage,
	baseUrl
}: CreatePaginatedResponseOptions<T>): PaginatedResponse<T> {
	const total = data.length
	const lastPage = Math.ceil(total / perPage)
	const start = (page - 1) * perPage
	const end = start + perPage
	const paginatedData = data.slice(start, end)

	const meta: PaginationMeta = {
		total,
		per_page: perPage,
		current_page: page,
		last_page: lastPage,
		first_page: 1,
		first_page_url: `${baseUrl}?page=1`,
		last_page_url: `${baseUrl}?page=${lastPage}`,
		next_page_url: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
		previous_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null
	}

	return {
		meta,
		data: paginatedData
	}
}

export function applyFilters<T>(
	data: T[],
	filters: Record<string, unknown>,
	filterFunctions: Record<string, (item: T, value: unknown) => boolean>
): T[] {
	return data.filter(item =>
		Object.entries(filters).every(([key, value]) => {
			if (!value || value === '' || value === 'all' || value === 'Total') {
				return true
			}

			const filterFn = filterFunctions[key]
			if (!filterFn) {
				return true
			}

			return filterFn(item, value)
		})
	)
}

export function applySorting<T>(
	data: T[],
	sortBy?: string,
	order: 'asc' | 'desc' = 'asc'
): T[] {
	if (!sortBy) {
		return data
	}

	return [...data].sort((a, b) => {
		const aValue = getNestedProperty(a, sortBy)
		const bValue = getNestedProperty(b, sortBy)

		if (aValue === bValue) {
			return 0
		}

		if (aValue === null || aValue === undefined) {
			return 1
		}
		if (bValue === null || bValue === undefined) {
			return -1
		}

		const comparison = aValue < bValue ? -1 : 1
		return order === 'asc' ? comparison : -comparison
	})
}

function getNestedProperty(obj: unknown, path: string): unknown {
	return path.split('.').reduce((current, key) => {
		if (current && typeof current === 'object' && key in current) {
			return (current as Record<string, unknown>)[key]
		}
		return current
	}, obj)
}

export function parseQueryParams(url: URL) {
	const page = Number(url.searchParams.get('page')) || 1
	const perPage = Number(url.searchParams.get('per_page')) || 10
	const sortBy = url.searchParams.get('sort_by') || undefined
	const order = (url.searchParams.get('order') || 'asc') as 'asc' | 'desc'

	// Parse all filters including search
	const filters: Record<string, unknown> = {}
	for (const [key, value] of url.searchParams.entries()) {
		if (!['page', 'per_page', 'sort_by', 'order'].includes(key)) {
			filters[key] = value
		}
	}

	return {
		page,
		perPage,
		sortBy,
		order,
		filters
	}
}
