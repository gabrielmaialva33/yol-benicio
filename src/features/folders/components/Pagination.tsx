const ROWS_PER_PAGE_LABEL = 'Linhas por página'
const OPTION_10 = '10'
const OPTION_20 = '20'
const OPTION_50 = '50'
const PAGE_SEPARATOR = ' de '
const PREVIOUS_TITLE = 'Previous'
const NEXT_TITLE = 'Next'

interface PaginationProps {
	page: number
	limit: number
	totalPages: number
	setPage: (page: number) => void
	setLimit: (limit: number) => void
}

export function Pagination({
	page,
	limit,
	totalPages,
	setPage,
	setLimit
}: PaginationProps) {
	return (
		<div className='mt-4 flex items-center justify-between'>
			<div className='flex items-center space-x-2 text-gray-600 text-sm'>
				<span>{ROWS_PER_PAGE_LABEL}</span>
				<select
					className='rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500'
					onChange={e => {
						setLimit(Number(e.target.value))
						setPage(1) // Reset to first page on limit change
					}}
					value={limit}
				>
					<option>{OPTION_10}</option>
					<option>{OPTION_20}</option>
					<option>{OPTION_50}</option>
				</select>
			</div>
			<div className='flex items-center space-x-4'>
				<span className='text-gray-600 text-sm'>
					{String(page).padStart(2, '0')}
					{PAGE_SEPARATOR}
					{String(totalPages).padStart(2, '0')}
				</span>
				<div className='flex items-center space-x-1'>
					<button
						className='p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50'
						disabled={page <= 1}
						onClick={() => setPage(page - 1)}
						type='button'
					>
						<svg
							className='h-5 w-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<title>{PREVIOUS_TITLE}</title>
							<path
								d='M15 19l-7-7 7-7'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
							/>
						</svg>
					</button>
					<button
						className='p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50'
						disabled={page >= totalPages}
						onClick={() => setPage(page + 1)}
						type='button'
					>
						<svg
							className='h-5 w-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<title>{NEXT_TITLE}</title>
							<path
								d='M9 5l7 7-7 7'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}
