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
	sort,
	onSort,
	allSelected,
	onSelectAll
}: FolderTableHeaderProps) {
	const {t} = useTranslation()

	return (
		<thead className='bg-[#F7F8F9]'>
			<tr>
				<th className='px-6 py-4 w-16' scope='col'>
					<input
						checked={allSelected}
						className='h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500'
						onChange={onSelectAll}
						type='checkbox'
					/>
				</th>
				<th
					className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32'
					onClick={() => onSort('code')}
					scope='col'
				>
					<div className='flex items-center'>
						{t('folders.fields.folderNumber')}
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
					className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80'
					scope='col'
				>
					{t('folders.fields.responsibleLawyer')}
				</th>
				<th
					className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-40'
					onClick={() => onSort('created_at')}
					scope='col'
				>
					{t('folders.fields.createdAt')}
				</th>
				<th
					className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20'
					scope='col'
				>
					{t('folders.fields.documents')}
				</th>
				<th
					className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'
					scope='col'
				>
					{t('folders.fields.area')}
				</th>
				<th
					className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32'
					scope='col'
				>
					{t('folders.fields.status')}
				</th>
				<th className='relative px-6 py-4 w-32' scope='col'>
					<span className='sr-only'>{t('common.actions')}</span>
				</th>
			</tr>
		</thead>
	)
}
