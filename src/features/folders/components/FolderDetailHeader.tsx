import {ChevronLeft} from 'lucide-react'
import {useNavigate} from 'react-router'
import type {FolderDetail} from '../types/folder.types'

interface FolderDetailHeaderProps {
	folder: FolderDetail
}

const StatusBadge = (props: {status: string}) => {
	const baseClasses =
		'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block'
	const statusClasses = {
		Completed: 'bg-green-100 text-green-800',
		Ativo: 'bg-green-100 text-green-800'
		// Add other statuses as needed
	}
	return (
		<span
			className={`${baseClasses} ${statusClasses[props.status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}
		>
			{props.status}
		</span>
	)
}

export function FolderDetailHeader(props: FolderDetailHeaderProps) {
	const navigate = useNavigate()
	const FOLDER_ID_LENGTH = 4

	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-4'>
				<button
					className='p-2 rounded-full bg-white hover:bg-gray-100'
					onClick={() => navigate(-1)}
					type='button'
				>
					<ChevronLeft className='w-6 h-6 text-gray-600' />
				</button>
				<div>
					<div className='flex items-center gap-2'>
						<h1 className='text-2xl font-semibold text-gray-900'>
							Pasta #{String(props.folder.id).substring(0, FOLDER_ID_LENGTH)}
						</h1>
						<StatusBadge status={props.folder.status} />
					</div>
					<p className='text-sm text-gray-500'>
						{props.folder.date} {props.folder.time}
					</p>
				</div>
			</div>
			<div className='flex items-center gap-4'>
				<button
					className='px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
					type='button'
				>
					Salvar
				</button>
				<button
					className='px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600'
					type='button'
				>
					Adicionar arquivos
				</button>
			</div>
		</div>
	)
}
