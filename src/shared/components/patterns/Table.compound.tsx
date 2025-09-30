/**
 * Table Compound Component
 * A flexible, composable table component with sorting, filtering, and pagination
 */

import {cn} from '@ui/utils/cn'
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Filter,
	Search
} from 'lucide-react'
import type React from 'react'
import {useMemo, useState} from 'react'
import {PAGINATION} from '@/core/constants/ui'
import {useTranslation} from '@/core/i18n'
import {createCompoundComponentContext} from './CompoundComponent'

const PAGINATION_RANGE_SEPARATOR = '-'

// Types
interface TableColumn<T> {
	key: keyof T | string
	header: string
	sortable?: boolean
	width?: string
	render?: (value: any, item: T) => React.ReactNode
	className?: string
}

interface TablePaginationConfig {
	page: number
	pageSize: number
	total: number
}

type SortDirection = 'asc' | 'desc' | null

interface TableSort<T> {
	key: keyof T | string
	direction: SortDirection
}

// Context
interface TableContextType<T> {
	data: T[]
	columns: TableColumn<T>[]
	sort: TableSort<T> | null
	pagination: TablePaginationConfig | null
	selectedRows: Set<string | number>
	isLoading?: boolean
	actions: {
		setSort: (key: keyof T | string) => void
		setPage: (page: number) => void
		setPageSize: (size: number) => void
		toggleRowSelection: (id: string | number) => void
		selectAllRows: () => void
		clearSelection: () => void
	}
}

const [TableProvider, useTable] =
	createCompoundComponentContext<TableContextType<any>>('Table')

// Main Component
interface TableProps<T> {
	children: React.ReactNode
	data: T[]
	columns: TableColumn<T>[]
	rowKey: keyof T
	pagination?: TablePaginationConfig
	onSort?: (sort: TableSort<T>) => void
	onPageChange?: (page: number) => void
	onPageSizeChange?: (size: number) => void
	isLoading?: boolean
	selectable?: boolean
}

export function Table<T extends Record<string, any>>({
	children,
	data,
	columns,
	rowKey,
	pagination,
	onSort,
	onPageChange,
	onPageSizeChange,
	isLoading = false,
	selectable = false
}: TableProps<T>) {
	const [sort, setInternalSort] = useState<TableSort<T> | null>(null)
	const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
		new Set()
	)

	const processedData = useMemo(() => {
		const result = [...data]

		// Client-side sorting (if no onSort provided)
		if (sort && !onSort) {
			result.sort((a, b) => {
				const aVal = a[sort.key as keyof T]
				const bVal = b[sort.key as keyof T]

				if (aVal === bVal) {
					return 0
				}

				const comparison = aVal < bVal ? -1 : 1
				return sort.direction === 'asc' ? comparison : -comparison
			})
		}

		return result
	}, [data, sort, onSort])

	const actions = {
		setSort: (key: keyof T | string) => {
			const newSort: TableSort<T> = {
				key,
				direction:
					sort?.key === key
						? sort.direction === 'asc'
							? 'desc'
							: sort.direction === 'desc'
								? null
								: 'asc'
						: 'asc'
			}

			if (newSort.direction === null) {
				setInternalSort(null)
				onSort?.(null as any)
			} else {
				setInternalSort(newSort)
				onSort?.(newSort)
			}
		},
		setPage: (page: number) => onPageChange?.(page),
		setPageSize: (size: number) => onPageSizeChange?.(size),
		toggleRowSelection: (id: string | number) => {
			const newSelection = new Set(selectedRows)
			if (newSelection.has(id)) {
				newSelection.delete(id)
			} else {
				newSelection.add(id)
			}
			setSelectedRows(newSelection)
		},
		selectAllRows: () => {
			const allIds = processedData.map(item => item[rowKey])
			setSelectedRows(new Set(allIds))
		},
		clearSelection: () => setSelectedRows(new Set())
	}

	return (
		<TableProvider
			value={{
				data: processedData,
				columns,
				sort,
				pagination: pagination || null,
				selectedRows,
				isLoading,
				actions
			}}
		>
			<div className='w-full space-y-4'>{children}</div>
		</TableProvider>
	)
}

// Sub-component: Search
Table.Search = function TableSearch({
	placeholder,
	onSearch
}: {
	placeholder?: string
	onSearch: (value: string) => void
}) {
	const {t} = useTranslation()
	const [value, setValue] = useState('')

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		onSearch(value)
	}

	return (
		<form className='flex gap-2' onSubmit={handleSearch}>
			<div className='relative flex-1'>
				<Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400' />
				<input
					className={cn(
						'w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10',
						'focus:outline-none focus:ring-2 focus:ring-brand-cyan'
					)}
					onChange={e => setValue(e.target.value)}
					placeholder={placeholder || t('common.search')}
					value={value}
				/>
			</div>
			<button
				className={cn(
					'rounded-lg bg-brand-cyan px-4 py-2 text-white',
					'transition-colors hover:bg-cyan-600'
				)}
				type='submit'
			>
				{t('common.search')}
			</button>
		</form>
	)
}

// Sub-component: Filters
Table.Filters = function TableFilters({children}: {children: React.ReactNode}) {
	const {t} = useTranslation()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className='space-y-2'>
			<button
				className='flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900'
				onClick={() => setIsOpen(!isOpen)}
			>
				<Filter className='h-4 w-4' />
				{t('filters.title')}
			</button>
			{isOpen && (
				<div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
					{children}
				</div>
			)}
		</div>
	)
}

// Sub-component: Container
Table.Container = function TableContainer() {
	const {data, columns, sort, selectedRows, isLoading, actions} = useTable()

	if (isLoading) {
		return <TableSkeleton columns={columns.length} />
	}

	return (
		<div className='overflow-x-auto rounded-lg border border-gray-200'>
			<table className='w-full'>
				<TableHeader
					allSelected={selectedRows.size === data.length}
					columns={columns}
					onSelectAll={
						selectedRows.size === data.length
							? actions.clearSelection
							: actions.selectAllRows
					}
					onSort={actions.setSort}
					selectable={selectedRows.size > 0}
					sort={sort}
				/>
				<TableBody
					columns={columns}
					data={data}
					onToggleSelection={actions.toggleRowSelection}
					selectedRows={selectedRows}
				/>
			</table>
		</div>
	)
}

// Sub-component: Pagination
Table.Pagination = function TablePagination() {
	const {pagination, actions} = useTable()
	const {t} = useTranslation()

	if (!pagination) {
		return null
	}

	const {page, pageSize, total} = pagination
	const totalPages = Math.ceil(total / pageSize)
	const start = (page - 1) * pageSize + 1
	const end = Math.min(page * pageSize, total)

	return (
		<div className='flex items-center justify-between'>
			<div className='text-gray-600 text-sm'>
				{t('pagination.showing')} {start}
				{PAGINATION_RANGE_SEPARATOR}
				{end} {t('pagination.of')} {total} {t('pagination.results')}
			</div>

			<div className='flex items-center gap-4'>
				<select
					className='rounded border border-gray-200 px-3 py-1 text-sm'
					onChange={e => actions.setPageSize(Number(e.target.value))}
					value={pageSize}
				>
					{PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
						<option key={size} value={size}>
							{size} {t('pagination.perPage')}
						</option>
					))}
				</select>

				<div className='flex items-center gap-2'>
					<button
						className={cn(
							'rounded p-1 hover:bg-gray-100',
							'disabled:cursor-not-allowed disabled:opacity-50'
						)}
						disabled={page <= 1}
						onClick={() => actions.setPage(page - 1)}
					>
						<ChevronLeft className='h-4 w-4' />
					</button>

					<span className='text-sm'>
						{t('pagination.page')} {page} {t('pagination.of')} {totalPages}
					</span>

					<button
						className={cn(
							'rounded p-1 hover:bg-gray-100',
							'disabled:cursor-not-allowed disabled:opacity-50'
						)}
						disabled={page >= totalPages}
						onClick={() => actions.setPage(page + 1)}
					>
						<ChevronRight className='h-4 w-4' />
					</button>
				</div>
			</div>
		</div>
	)
}

// Internal components
function TableHeader<T>({
	columns,
	sort,
	onSort,
	selectable,
	allSelected,
	onSelectAll
}: {
	columns: TableColumn<T>[]
	sort: TableSort<T> | null
	onSort: (key: keyof T | string) => void
	selectable: boolean
	allSelected: boolean
	onSelectAll: () => void
}) {
	return (
		<thead className='border-gray-200 border-b bg-gray-50'>
			<tr>
				{selectable && (
					<th className='w-10 px-4 py-3'>
						<input
							checked={allSelected}
							onChange={onSelectAll}
							type='checkbox'
						/>
					</th>
				)}
				{columns.map(column => (
					<th
						className={cn(
							'px-4 py-3 text-left font-semibold text-gray-900 text-sm',
							column.className,
							column.sortable && 'cursor-pointer hover:bg-gray-100'
						)}
						key={String(column.key)}
						onClick={() => column.sortable && onSort(column.key)}
						style={{width: column.width}}
					>
						<div className='flex items-center gap-2'>
							{column.header}
							{column.sortable && (
								<SortIcon
									active={sort?.key === column.key}
									direction={sort?.key === column.key ? sort.direction : null}
								/>
							)}
						</div>
					</th>
				))}
			</tr>
		</thead>
	)
}

function TableBody<T extends Record<string, any>>({
	data,
	columns,
	selectedRows,
	onToggleSelection
}: {
	data: T[]
	columns: TableColumn<T>[]
	selectedRows: Set<string | number>
	onToggleSelection: (id: string | number) => void
}) {
	const {t} = useTranslation()

	if (data.length === 0) {
		return (
			<tbody>
				<tr>
					<td
						className='px-4 py-8 text-center text-gray-500'
						colSpan={columns.length + (selectedRows.size > 0 ? 1 : 0)}
					>
						{t('common.noData')}
					</td>
				</tr>
			</tbody>
		)
	}

	return (
		<tbody className='divide-y divide-gray-200'>
			{data.map((item, index) => (
				<tr
					className='transition-colors hover:bg-gray-50'
					key={item.id || index}
				>
					{selectedRows.size > 0 && (
						<td className='px-4 py-3'>
							<input
								checked={selectedRows.has(item.id)}
								onChange={() => onToggleSelection(item.id)}
								type='checkbox'
							/>
						</td>
					)}
					{columns.map(column => (
						<td
							className={cn('px-4 py-3 text-sm', column.className)}
							key={String(column.key)}
						>
							{column.render
								? column.render(item[column.key as keyof T], item)
								: item[column.key as keyof T]}
						</td>
					))}
				</tr>
			))}
		</tbody>
	)
}

function SortIcon({
	active,
	direction
}: {
	active: boolean
	direction: SortDirection
}) {
	if (!(active && direction)) {
		return <ArrowUpDown className='h-4 w-4 text-gray-400' />
	}

	return direction === 'asc' ? (
		<ArrowUp className='h-4 w-4 text-brand-cyan' />
	) : (
		<ArrowDown className='h-4 w-4 text-brand-cyan' />
	)
}

function TableSkeleton({columns}: {columns: number}) {
	return (
		<div className='overflow-x-auto rounded-lg border border-gray-200'>
			<table className='w-full'>
				<thead className='border-gray-200 border-b bg-gray-50'>
					<tr>
						{Array.from({length: columns}).map((_, i) => (
							<th className='px-4 py-3' key={i}>
								<div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
							</th>
						))}
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-200'>
					{Array.from({length: 5}).map((_, i) => (
						<tr key={i}>
							{Array.from({length: columns}).map((_, j) => (
								<td className='px-4 py-3' key={j}>
									<div className='h-4 w-32 animate-pulse rounded bg-gray-200' />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

// Example usage:
/*
<Table
  data={folders}
  columns={columns}
  rowKey="id"
  pagination={{page: 1, pageSize: 20, total: 100}}
  onSort={handleSort}
  onPageChange={handlePageChange}
>
  <Table.Search onSearch={handleSearch} />
  <Table.Filters>
    <FilterComponents />
  </Table.Filters>
  <Table.Container />
  <Table.Pagination />
</Table>
*/

// Export types
export type {TableColumn, TablePaginationConfig, SortDirection, TableSort}
