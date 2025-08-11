import {useState} from 'react'
import {AppliedFilters} from '../components/AppliedFilters'
import {FolderFilters} from '../components/FolderFilters'
import {FolderTable} from '../components/FolderTable'
import {FolderTabs} from '../components/FolderTabs'
import {Pagination} from '../components/Pagination'
import {useFolderConsultation} from '../hooks/use-folder-consultation'

export function FolderConsultationPage() {
	const {
		folders,
		pagination,
		isLoading,
		isError,
		setPage,
		setLimit,
		filters,
		setFilters,
		sort,
		setSort
	} = useFolderConsultation()
	const [selectedFolders, setSelectedFolders] = useState<string[]>([])

	if (isLoading) {
		return <div>Carregando...</div>
	}

	if (isError) {
		return <div>Ocorreu um erro ao buscar as pastas.</div>
	}

	return (
		<div className='p-4 sm:p-6 lg:p-8 bg-[#F1F1F2] min-h-full'>
			<div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
				<div className='px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-4'>
					<FolderTabs filters={filters} setFilters={setFilters} />
				</div>
				<div className='px-2 pb-6 lg:pb-8'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4'>
						<div className='flex-1 min-w-0'>
							<FolderFilters filters={filters} setFilters={setFilters} />
						</div>
						<div className='flex items-center space-x-3 px-4 sm:px-6 shrink-0'>
							<button
								className='px-3 sm:px-4 py-2 h-10 text-xs sm:text-sm font-bold text-[#00B8D9] bg-white border border-[#00B8D9]/48 rounded-[20px] hover:bg-[#00B8D9]/5 disabled:opacity-50 transition-colors whitespace-nowrap'
								disabled={selectedFolders.length === 0}
								type='button'
							>
								Baixar
							</button>
							<button
								className='px-3 sm:px-4 py-2 h-10 text-xs sm:text-sm font-bold text-[#00B8D9] bg-white border border-[#00B8D9]/48 rounded-[20px] hover:bg-[#00B8D9]/5 transition-colors whitespace-nowrap'
								type='button'
							>
								Adicionar colunas
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
					<div className='mt-6'>
						<FolderTable
							folders={folders}
							selectedFolders={selectedFolders}
							setSelectedFolders={setSelectedFolders}
							setSort={setSort}
							sort={sort}
						/>
					</div>
					<div className='px-4 sm:px-6 mt-6'>
						<Pagination {...pagination} setLimit={setLimit} setPage={setPage} />
					</div>
				</div>
			</div>
		</div>
	)
}
