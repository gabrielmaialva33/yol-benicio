import {ChevronLeft} from 'lucide-react'
import {useNavigate} from 'react-router'
import type {FolderDetail} from '../types/folder.types'

interface FolderDetailHeaderProps {
	folder: FolderDetail
}

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
			className={`${baseClasses} ${statusClasses[props.status as keyof typeof statusClasses] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
		>
			{props.status}
		</span>
	)
}

export function FolderDetailHeader(props: FolderDetailHeaderProps) {
	const navigate = useNavigate()
	const FOLDER_ID_LENGTH = 4

	return (
		<div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-6'>
					<button
						className='p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-300 transition-colors'
						onClick={() => navigate(-1)}
						type='button'
					>
						<ChevronLeft className='w-5 h-5 text-gray-600' />
					</button>
					<div>
						<div className='flex items-center gap-3 mb-2'>
							<h1 className='text-2xl font-semibold text-[#161C24]'>
								Pasta #{String(props.folder.id).substring(0, FOLDER_ID_LENGTH)}
							</h1>
							<StatusBadge status={props.folder.status} />
						</div>
						<p className='text-sm text-[#919EAB]'>
							Criado em {props.folder.date} às {props.folder.time}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<button
						className='px-6 py-3 text-sm font-semibold text-[#637381] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
						type='button'
					>
						Salvar
					</button>
					<button
						className='px-6 py-3 text-sm font-semibold text-white bg-[#00B8D9] rounded-lg hover:bg-[#00B8D9]/90 transition-colors'
						type='button'
					>
						Adicionar arquivos
					</button>
				</div>
			</div>
		</div>
	)
}
