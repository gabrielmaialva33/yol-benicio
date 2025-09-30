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
					<div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>
						<h3 className='text-lg font-semibold text-[#161C24] mb-6'>
							{UI_TEXT.GENERAL_INFO_TITLE}
						</h3>
						<p className='text-[#919EAB]'>{UI_TEXT.GENERAL_INFO_CONTENT}</p>
					</div>
				)
			case 'publicacoes':
				return (
					<div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>
						<h3 className='text-lg font-semibold text-[#161C24] mb-6'>
							{UI_TEXT.PUBLICATIONS_TITLE}
						</h3>
						<p className='text-[#919EAB]'>{UI_TEXT.PUBLICATIONS_CONTENT}</p>
					</div>
				)
			case 'agenda':
				return (
					<div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>
						<h3 className='text-lg font-semibold text-[#161C24] mb-6'>
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
		<div className='p-4 sm:p-6 lg:p-8 bg-[#F1F1F2] min-h-screen'>
			<FolderDetailHeader folder={folder} />
			<div className='mt-6 flex flex-col lg:flex-row gap-6'>
				<FolderDetailSidebar activeTab={activeTab} onTabChange={setActiveTab} />
				<div className='flex-1 min-w-0'>{renderContent()}</div>
			</div>
		</div>
	)
}
