import {ChevronLeft} from 'lucide-react'
import {useNavigate} from 'react-router'
import type {FolderDetail} from '../types/folder.types'

interface FolderDetailHeaderProps {
	folder: FolderDetail
}

const FOLDER_PREFIX = 'Pasta #'
const CREATED_AT_PREFIX = 'Criado em'
const AT_TIME_SEPARATOR = 'às'
const SAVE_BUTTON_LABEL = 'Salvar'
const ADD_FILES_BUTTON_LABEL = 'Adicionar arquivos'

const StatusBadge = (props: {status: string}) => {
	const baseClasses =
		'px-3 py-1.5 text-xs font-medium rounded-full inline-block border'
	const statusClasses = {
		Completed: 'bg-green-50 text-green-700 border-green-200',
		Concluído: 'bg-green-50 text-green-700 border-green-200',
		Ativo: 'bg-blue-50 text-blue-700 border-blue-200',
		Pendente: 'bg-orange-50 text-orange-700 border-orange-200',
		Cancelado: 'bg-red-50 text-red-700 border-red-200',
		Arquivado: 'bg-gray-50 text-gray-700 border-gray-200'
	}
	return (
		<span
			className={`${baseClasses} ${statusClasses[props.status as keyof typeof statusClasses] || 'border-gray-200 bg-gray-50 text-gray-700'}`}
		>
			{props.status}
		</span>
	)
}

export function FolderDetailHeader(props: FolderDetailHeaderProps) {
	const navigate = useNavigate()
	const FolderIdLength = 4

	return (
		<div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-6'>
					<button
						className='rounded-lg border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-100'
						onClick={() => navigate(-1)}
						type='button'
					>
						<ChevronLeft className='h-5 w-5 text-gray-600' />
					</button>
					<div>
						<div className='mb-2 flex items-center gap-3'>
							<h1 className='font-semibold text-2xl text-[#161C24]'>
								{FOLDER_PREFIX}
								{String(props.folder.id).substring(0, FolderIdLength)}
							</h1>
							<StatusBadge status={props.folder.status} />
						</div>
						<p className='text-[#919EAB] text-sm'>
							{CREATED_AT_PREFIX} {props.folder.date} {AT_TIME_SEPARATOR}{' '}
							{props.folder.time}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<button
						className='rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-[#637381] text-sm transition-colors hover:bg-gray-50'
						type='button'
					>
						{SAVE_BUTTON_LABEL}
					</button>
					<button
						className='rounded-lg bg-[#00B8D9] px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#00B8D9]/90'
						type='button'
					>
						{ADD_FILES_BUTTON_LABEL}
					</button>
				</div>
			</div>
		</div>
	)
}
