import type {Folder} from '@shared/types/domain'
import {FolderArea, FolderStatus} from '@shared/types/domain'
import {DateTime} from 'luxon'
import {Link} from 'react-router'
import arrowRightIcon from '/icons/arrow-right.svg'
import moreIcon from '/icons/more-horizontal.svg'

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
	[FolderStatus.ACTIVE]: 'bg-blue-50 text-blue-700 border border-blue-200',
	[FolderStatus.COMPLETED]:
		'bg-green-50 text-green-700 border border-green-200',
	[FolderStatus.PENDING]:
		'bg-orange-50 text-orange-700 border border-orange-200',
	[FolderStatus.CANCELLED]: 'bg-red-50 text-red-700 border border-red-200',
	[FolderStatus.ARCHIVED]: 'bg-gray-50 text-gray-700 border border-gray-200'
}

const StatusBadge = (props: {status: FolderStatus}) => {
	const {status} = props
	const baseClasses =
		'px-4 py-2 text-sm font-medium rounded-full inline-block min-w-[80px] text-center'
	return (
		<span className={`${baseClasses} ${statusColors[status]}`}>
			{statusNames[status]}
		</span>
	)
}

interface FolderTableRowProps {
	folder: Folder
	isSelected: boolean
	onSelect: (id: string) => void
}

export function FolderTableRow({
	folder,
	isSelected,
	onSelect
}: FolderTableRowProps) {
	const createdDate = DateTime.fromISO(folder.created_at)
	const dateStr = createdDate.toFormat('dd LLL yyyy', {locale: 'pt-BR'})
	const timeStr = createdDate.toFormat('HH:mm')

	return (
		<tr className={isSelected ? 'bg-cyan-50' : ''}>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
				<input
					checked={isSelected}
					className='h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500'
					onChange={() => onSelect(folder.id.toString())}
					type='checkbox'
				/>
			</td>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
				{`#${folder.code}`}
			</td>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
				<div className='flex items-center'>
					<div className='flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10'>
						<img
							alt={folder.responsible_lawyer.full_name}
							className='h-8 sm:h-10 w-8 sm:w-10 rounded-full object-cover'
							height={40}
							src={folder.responsible_lawyer.avatar_url || '/placeholder.svg'}
							width={40}
						/>
					</div>
					<div className='ml-3 sm:ml-4 min-w-0'>
						<div className='text-sm font-medium text-gray-900 truncate'>
							{folder.responsible_lawyer.full_name}
						</div>
						<div className='text-sm text-gray-500 truncate'>
							{folder.responsible_lawyer.email}
						</div>
					</div>
				</div>
			</td>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
				<div className='text-sm font-medium text-gray-900'>{dateStr}</div>
				<div className='text-sm text-gray-500'>{timeStr}</div>
			</td>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center'>
				{folder.documents_count}
			</td>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
				<div className='truncate'>{areaNames[folder.area]}</div>
			</td>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
				<StatusBadge status={folder.status} />
			</td>
			<td className='px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
				<div className='flex items-center justify-end space-x-3'>
					<Link
						className='p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-700 transition-colors'
						to={`/dashboard/folders/consultation/${folder.id}`}
					>
						<img
							alt='Go'
							className='w-6 h-6'
							height={24}
							src={arrowRightIcon || '/placeholder.svg'}
							width={24}
						/>
					</Link>
					<button
						className='p-3 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-700 transition-colors'
						type='button'
					>
						<img
							alt='More'
							className='w-6 h-6 rotate-90'
							height={24}
							src={moreIcon || '/placeholder.svg'}
							width={24}
						/>
					</button>
				</div>
			</td>
		</tr>
	)
}
