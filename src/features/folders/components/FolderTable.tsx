import type {Folder} from '@shared/types/domain'
import type React from 'react'
import {FolderTableHeader} from './FolderTableHeader'
import {FolderTableRow} from './FolderTableRow'

interface FolderTableProps {
	folders: Folder[]
	sort: {column: string; direction: string}
	setSort: (sort: {column: string; direction: string}) => void
	selectedFolders: string[]
	setSelectedFolders: (selectedFolders: string[]) => void
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
		<div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
			<div className='overflow-x-auto'>
				<table className='w-full min-w-[1200px] divide-y divide-gray-200'>
					<FolderTableHeader
						allSelected={selectedFolders.length === folders.length}
						onSelectAll={handleSelectAll}
						onSort={handleSort}
						sort={sort}
					/>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{folders.map(folder => (
							<FolderTableRow
								folder={folder}
								isSelected={
									selectedFolders.indexOf(folder.id.toString()) !== -1
								}
								key={folder.id}
								onSelect={handleSelectOne}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
