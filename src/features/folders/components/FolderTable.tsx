import {Star} from 'lucide-react'
import {DateTime} from 'luxon'
import type React from 'react'
import {Link} from 'react-router'
import arrowRightIcon from '/icons/arrow-right.svg'
import downIcon from '/icons/down.svg'
import moreIcon from '/icons/more-horizontal.svg'
import type {Folder} from '../../../shared/types/domain'
import {FolderArea, FolderStatus} from '../../../shared/types/domain'

const areaNames: Record<FolderArea, string> = {
	[FolderArea.CIVIL_LITIGATION]: 'Cível Contencioso',
	[FolderArea.LABOR]: 'Trabalhista',
	[FolderArea.TAX]: 'Tributário',
	[FolderArea.CRIMINAL]: 'Criminal',
	[FolderArea.ADMINISTRATIVE]: 'Administrativo',
	[FolderArea.CONSUMER]: 'Consumidor',
	[FolderArea.FAMILY]: 'Família',
	[FolderArea.CORPORATE]: 'Empresarial',
	[FolderArea.ENVIRONMENTAL]: 'Ambiental',
	[FolderArea.INTELLECTUAL_PROPERTY]: 'Propriedade Intelectual',
	[FolderArea.REAL_ESTATE]: 'Imobiliário',
	[FolderArea.INTERNATIONAL]: 'Internacional'
}

const statusNames: Record<FolderStatus, string> = {
	[FolderStatus.ACTIVE]: 'Ativo',
	[FolderStatus.COMPLETED]: 'Concluído',
	[FolderStatus.PENDING]: 'Pendente',
	[FolderStatus.CANCELLED]: 'Cancelado',
	[FolderStatus.ARCHIVED]: 'Arquivado'
}

const statusColors: Record<FolderStatus, string> = {
	[FolderStatus.ACTIVE]: 'bg-blue-100 text-blue-800',
	[FolderStatus.COMPLETED]: 'bg-green-100 text-green-800',
	[FolderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
	[FolderStatus.CANCELLED]: 'bg-red-100 text-red-800',
	[FolderStatus.ARCHIVED]: 'bg-gray-100 text-gray-800'
}

interface FolderTableProps {
	folders: Folder[]
	sort: {
		column: string
		direction: string
	}
	setSort: (sort: {column: string; direction: string}) => void
	selectedFolders: string[]
	setSelectedFolders: (selectedFolders: string[]) => void
}

const StatusBadge = (props: {status: FolderStatus}) => {
	const {status} = props
	const baseClasses =
		'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block'

	return (
		<span className={`${baseClasses} ${statusColors[status]}`}>
			{statusNames[status]}
		</span>
	)
}

export function FolderTable({
	folders,
	sort,
	setSort,
	selectedFolders,
	setSelectedFolders
}: FolderTableProps) {
	const handleSort = (column: string) => {
		const direction =
			sort.column === column && sort.direction === 'asc' ? 'desc' : 'asc'
		setSort({column, direction})
	}

	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedFolders(folders.map(folder => folder.id.toString()))
		} else {
			setSelectedFolders([])
		}
	}

	const handleSelectOne = (id: string) => {
		const selectedIndex = selectedFolders.indexOf(id)
		let newSelected: string[] = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selectedFolders, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selectedFolders.slice(1))
		} else if (selectedIndex === selectedFolders.length - 1) {
			newSelected = newSelected.concat(selectedFolders.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selectedFolders.slice(0, selectedIndex),
				selectedFolders.slice(selectedIndex + 1)
			)
		}

		setSelectedFolders(newSelected)
	}

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3' scope='col'>
							<input
								checked={selectedFolders.length === folders.length}
								className='h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500'
								onChange={handleSelectAll}
								type='checkbox'
							/>
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
							onClick={() => handleSort('code')}
							scope='col'
						>
							<div className='flex items-center'>
								Código
								<img
									alt='Sort'
									className='w-4 h-4 ml-1 opacity-50'
									height={16}
									src={downIcon || '/placeholder.svg'}
									width={16}
								/>
							</div>
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							scope='col'
						>
							Responsável
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
							onClick={() => handleSort('created_at')}
							scope='col'
						>
							Data de inclusão
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							scope='col'
						>
							Docs
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							scope='col'
						>
							Área
						</th>
						<th
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							scope='col'
						>
							Status
						</th>
						<th className='relative px-6 py-3' scope='col'>
							<span className='sr-only'>Actions</span>
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{folders.map(folder => {
						const isSelected =
							selectedFolders.indexOf(folder.id.toString()) !== -1
						const createdDate = DateTime.fromISO(folder.created_at)
						const dateStr = createdDate.toFormat('dd LLL yyyy', {
							locale: 'pt-BR'
						})
						const timeStr = createdDate.toFormat('HH:mm')

						return (
							<tr className={isSelected ? 'bg-cyan-50' : ''} key={folder.id}>
								<td className='px-6 py-4 whitespace-nowrap'>
									<input
										checked={isSelected}
										className='h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500'
										onChange={() => handleSelectOne(folder.id.toString())}
										type='checkbox'
									/>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									#{folder.code}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<img
												alt={folder.responsible_lawyer.full_name}
												className='h-10 w-10 rounded-full'
												height={40}
												src={
													folder.responsible_lawyer.avatar_url ||
													'/placeholder.svg'
												}
												width={40}
											/>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-900'>
												{folder.responsible_lawyer.full_name}
											</div>
											<div className='text-sm text-gray-500'>
												{folder.responsible_lawyer.email}
											</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-900'>{dateStr}</div>
									<div className='text-sm text-gray-500'>{timeStr}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{folder.documents_count}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{areaNames[folder.area]}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<StatusBadge status={folder.status} />
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
									<div className='flex items-center justify-end space-x-2'>
										<button
											className='p-2 rounded-full hover:bg-gray-200'
											onClick={() =>
												fetch(`/api/folders/${folder.id}/favorite`, {
													method: 'PATCH'
												})
											}
											type='button'
										>
											<Star
												className={`w-5 h-5 ${folder.is_favorite ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
											/>
										</button>
										<Link
											className='p-2 rounded-full bg-gray-100 hover:bg-gray-200'
											to={`/dashboard/folders/consultation/${folder.id}`}
										>
											<img
												alt='Go'
												className='w-4 h-4'
												height={16}
												src={arrowRightIcon || '/placeholder.svg'}
												width={16}
											/>
										</Link>
										<button
											className='text-gray-400 hover:text-gray-600'
											type='button'
										>
											<img
												alt='More'
												className='w-5 h-5'
												height={20}
												src={moreIcon || '/placeholder.svg'}
												width={20}
											/>
										</button>
									</div>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
