import {useState} from 'react'
import {useParams} from 'react-router'
import {useFolderDetail} from '../hooks/use-folder-detail'
import {FolderDetailHeader} from './FolderDetailHeader'
import {FolderDetailSidebar} from './FolderDetailSidebar'
import {FolderProcessForm} from './FolderProcessForm'
import {ProcessTimeline} from './ProcessTimeline'

// UI text constants
const UI_TEXT = {
	LOADING: 'Carregando...',
	ERROR: 'Erro ao buscar os detalhes da pasta.',
	GENERAL_INFO_TITLE: 'Informações Gerais',
	GENERAL_INFO_CONTENT: 'Conteúdo das informações gerais...',
	PUBLICATIONS_TITLE: 'Publicações',
	PUBLICATIONS_CONTENT: 'Lista de publicações...',
	AGENDA_TITLE: 'Agenda',
	AGENDA_CONTENT: 'Eventos agendados...'
} as const

export function FolderDetailPage() {
	const {folderId} = useParams<{folderId: string}>()
	const [activeTab, setActiveTab] = useState('processo')
	const {folder, isLoading, isError} = useFolderDetail(
		folderId === '1830' ? '1830' : folderId
	)

	if (isLoading) {
		return <div>{UI_TEXT.LOADING}</div>
	}

	if (isError || !folder) {
		return <div>{UI_TEXT.ERROR}</div>
	}

	const renderContent = () => {
		switch (activeTab) {
			case 'andamento':
				return <ProcessTimeline folderId={folder.id} />
			case 'informacoes':
				return (
					<div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
						<h3 className='mb-6 font-semibold text-[#161C24] text-lg'>
							{UI_TEXT.GENERAL_INFO_TITLE}
						</h3>
						<p className='text-[#919EAB]'>{UI_TEXT.GENERAL_INFO_CONTENT}</p>
					</div>
				)
			case 'publicacoes':
				return (
					<div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
						<h3 className='mb-6 font-semibold text-[#161C24] text-lg'>
							{UI_TEXT.PUBLICATIONS_TITLE}
						</h3>
						<p className='text-[#919EAB]'>{UI_TEXT.PUBLICATIONS_CONTENT}</p>
					</div>
				)
			case 'agenda':
				return (
					<div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
						<h3 className='mb-6 font-semibold text-[#161C24] text-lg'>
							{UI_TEXT.AGENDA_TITLE}
						</h3>
						<p className='text-[#919EAB]'>{UI_TEXT.AGENDA_CONTENT}</p>
					</div>
				)
			default:
				return <FolderProcessForm folder={folder} />
		}
	}

	return (
		<div className='min-h-screen bg-[#F1F1F2] p-4 sm:p-6 lg:p-8'>
			<FolderDetailHeader folder={folder} />
			<div className='mt-6 flex flex-col gap-6 lg:flex-row'>
				<FolderDetailSidebar activeTab={activeTab} onTabChange={setActiveTab} />
				<div className='min-w-0 flex-1'>{renderContent()}</div>
			</div>
		</div>
	)
}
