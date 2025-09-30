import {useState} from 'react'
import {AppliedFilters} from '../components/AppliedFilters'
import {FolderFilters} from '../components/FolderFilters'
import {FolderTable} from '../components/FolderTable'
import {FolderTableSkeleton} from '../components/FolderTableSkeleton'
import {FolderTabs} from '../components/FolderTabs'
import {Pagination} from '../components/Pagination'
import {useFolderConsultation} from '../hooks/use-folder-consultation'

const ERROR_MESSAGE = 'Ocorreu um erro ao buscar as pastas.'
const DOWNLOAD_BUTTON_LABEL = 'Baixar'
const ADD_COLUMNS_BUTTON_LABEL = 'Adicionar colunas'
const UPDATING_LABEL = 'Atualizando...'

export function FolderConsultationPage() {
	const {
		folders,
		pagination,
		isInitialLoading,
		isRefetching,
		isError,
		setPage,
		setLimit,
		filters,
		setFilters,
		sort,
		setSort
	} = useFolderConsultation()
	const [selectedFolders, setSelectedFolders] = useState<string[]>([])

	if (isInitialLoading) {
		return (
			<div className='min-h-full bg-[#F1F1F2] p-4 sm:p-6 lg:p-8'>
				<div className='rounded-2xl border border-gray-100 bg-white shadow-sm'>
					<div className='px-4 pt-6 pb-4 sm:px-6 lg:px-8 lg:pt-8'>
						<FolderTabs filters={filters} setFilters={setFilters} />
					</div>
					<div className='px-2 pb-6 lg:pb-8'>
						<div className='mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center'>
							<div className='min-w-0 flex-1'>
								<FolderFilters
									filters={filters}
									isLoading={false}
									setFilters={setFilters}
								/>
							</div>
						</div>
						<div className='mt-6'>
							<FolderTableSkeleton />
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isError && folders.length === 0) {
		return <div>{ERROR_MESSAGE}</div>
	}

	return (
		<div className='min-h-full bg-[#F1F1F2] p-4 sm:p-6 lg:p-8'>
			<div className='rounded-2xl border border-gray-100 bg-white shadow-sm'>
				<div className='px-4 pt-6 pb-4 sm:px-6 lg:px-8 lg:pt-8'>
					<FolderTabs filters={filters} setFilters={setFilters} />
				</div>
				<div className='px-2 pb-6 lg:pb-8'>
					<div className='mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center'>
						<div className='min-w-0 flex-1'>
							<FolderFilters
								filters={filters}
								isLoading={isRefetching}
								setFilters={setFilters}
							/>
						</div>
						<div className='flex shrink-0 items-center space-x-3 px-4 sm:px-6'>
							<button
								className='h-10 whitespace-nowrap rounded-[20px] border border-[#00B8D9]/48 bg-white px-3 py-2 font-bold text-[#00B8D9] text-xs transition-colors hover:bg-[#00B8D9]/5 disabled:opacity-50 sm:px-4 sm:text-sm'
								disabled={selectedFolders.length === 0}
								type='button'
							>
								{DOWNLOAD_BUTTON_LABEL}
							</button>
							<button
								className='h-10 whitespace-nowrap rounded-[20px] border border-[#00B8D9]/48 bg-white px-3 py-2 font-bold text-[#00B8D9] text-xs transition-colors hover:bg-[#00B8D9]/5 sm:px-4 sm:text-sm'
								type='button'
							>
								{ADD_COLUMNS_BUTTON_LABEL}
							</button>
						</div>
					</div>
					<div className='px-4 sm:px-6'>
						<AppliedFilters
							filters={filters}
							resultCount={pagination.total}
							setFilters={setFilters}
						/>
					</div>
					<div className='relative mt-6'>
						{isRefetching && (
							<div className='absolute inset-0 z-10 flex items-center justify-center bg-white/60'>
								<div className='flex items-center space-x-2'>
									<div className='h-6 w-6 animate-spin rounded-full border-[#00B8D9] border-b-2' />
									<span className='text-gray-600 text-sm'>
										{UPDATING_LABEL}
									</span>
								</div>
							</div>
						)}
						<FolderTable
							folders={folders}
							selectedFolders={selectedFolders}
							setSelectedFolders={setSelectedFolders}
							setSort={setSort}
							sort={sort}
						/>
					</div>
					<div className='mt-6 px-4 sm:px-6'>
						<Pagination {...pagination} setLimit={setLimit} setPage={setPage} />
					</div>
				</div>
			</div>
		</div>
	)
}
