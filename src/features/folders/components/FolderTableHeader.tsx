import type React from 'react'
import {useTranslation} from '@/core/i18n'
import downIcon from '/icons/down.svg'

interface FolderTableHeaderProps {
	sort: {column: string; direction: string}
	onSort: (column: string) => void
	allSelected: boolean
	onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FolderTableHeader({
	sort: _sort,
	onSort,
	allSelected,
	onSelectAll
}: FolderTableHeaderProps) {
	const {t} = useTranslation()

	return (
		<thead className='bg-[#F7F8F9]'>
			<tr>
				<th className='w-16 px-6 py-4' scope='col'>
					<input
						checked={allSelected}
						className='h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500'
						onChange={onSelectAll}
						type='checkbox'
					/>
				</th>
				<th
					className='w-32 cursor-pointer px-6 py-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
					onClick={() => onSort('code')}
					scope='col'
				>
					<div className='flex items-center'>
						{t('folders.fields.folderNumber')}
						<img
							alt='Sort'
							className='ml-1 h-4 w-4 opacity-50'
							height={16}
							src={downIcon || '/placeholder.svg'}
							width={16}
						/>
					</div>
				</th>
				<th
					className='w-80 px-6 py-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
					scope='col'
				>
					{t('folders.fields.responsibleLawyer')}
				</th>
				<th
					className='w-40 cursor-pointer px-6 py-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
					onClick={() => onSort('created_at')}
					scope='col'
				>
					{t('folders.fields.createdAt')}
				</th>
				<th
					className='w-20 px-6 py-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
					scope='col'
				>
					{t('folders.fields.documents')}
				</th>
				<th
					className='w-48 px-6 py-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
					scope='col'
				>
					{t('folders.fields.area')}
				</th>
				<th
					className='w-32 px-6 py-4 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
					scope='col'
				>
					{t('folders.fields.status')}
				</th>
				<th className='relative w-32 px-6 py-4' scope='col'>
					<span className='sr-only'>{t('common.actions')}</span>
				</th>
			</tr>
		</thead>
	)
}
