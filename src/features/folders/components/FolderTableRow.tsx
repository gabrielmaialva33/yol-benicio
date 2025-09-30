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
			<td className='whitespace-nowrap px-3 py-4 sm:px-6'>
				<input
					checked={isSelected}
					className='h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500'
					onChange={() => onSelect(folder.id.toString())}
					type='checkbox'
				/>
			</td>
			<td className='whitespace-nowrap px-3 py-4 font-medium text-gray-900 text-sm sm:px-6'>
				{`#${folder.code}`}
			</td>
			<td className='whitespace-nowrap px-3 py-4 sm:px-6'>
				<div className='flex items-center'>
					<div className='h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10'>
						<img
							alt={folder.responsible_lawyer.full_name}
							className='h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10'
							height={40}
							src={folder.responsible_lawyer.avatar_url || '/placeholder.svg'}
							width={40}
						/>
					</div>
					<div className='ml-3 min-w-0 sm:ml-4'>
						<div className='truncate font-medium text-gray-900 text-sm'>
							{folder.responsible_lawyer.full_name}
						</div>
						<div className='truncate text-gray-500 text-sm'>
							{folder.responsible_lawyer.email}
						</div>
					</div>
				</div>
			</td>
			<td className='whitespace-nowrap px-3 py-4 sm:px-6'>
				<div className='font-medium text-gray-900 text-sm'>{dateStr}</div>
				<div className='text-gray-500 text-sm'>{timeStr}</div>
			</td>
			<td className='whitespace-nowrap px-3 py-4 text-center font-medium text-gray-900 text-sm sm:px-6'>
				{folder.documents_count}
			</td>
			<td className='whitespace-nowrap px-3 py-4 text-gray-900 text-sm sm:px-6'>
				<div className='truncate'>{areaNames[folder.area]}</div>
			</td>
			<td className='whitespace-nowrap px-3 py-4 sm:px-6'>
				<StatusBadge status={folder.status} />
			</td>
			<td className='whitespace-nowrap px-3 py-4 text-right font-medium text-sm sm:px-6'>
				<div className='flex items-center justify-end space-x-3'>
					<Link
						className='rounded-full bg-gray-100 p-3 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700'
						to={`/dashboard/folders/consultation/${folder.id}`}
					>
						<img
							alt='Go'
							className='h-6 w-6'
							height={24}
							src={arrowRightIcon || '/placeholder.svg'}
							width={24}
						/>
					</Link>
					<button
						className='rounded-full p-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700'
						type='button'
					>
						<img
							alt='More'
							className='h-6 w-6 rotate-90'
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
