import {
	Download,
	Edit3,
	Eye,
	FileText,
	Link2Off,
	MessageSquare
} from 'lucide-react'
import {DateTime} from 'luxon'
import type {FolderMovement} from '../types/folder.types'

interface TimelineEvent extends FolderMovement {
	id: string
	title: string
	subtitle?: string
	referenceNumber?: string
	addedBy: {
		name: string
		avatar?: string
	}
	category?: string[]
	documents?: {
		id: string
		name: string
		type: 'pdf' | 'doc' | 'image'
		size: string
	}[]
	status?: 'success' | 'info' | 'warning'
	actionText?: string
	actionDescription?: string
}

// Mock data baseado no design do Figma
const mockTimelineEvents: TimelineEvent[] = [
	{
		id: '1',
		date: '2024-11-29T14:30:00',
		title: 'Faturamento realizado com sucesso',
		description: 'A pasta foi encerrada e faturada.',
		responsible: 'Sistema',
		type: 'edit',
		addedBy: {
			name: 'Ana Silva',
			avatar: 'https://i.pravatar.cc/150?img=1'
		},
		status: 'success',
		actionText: 'A pasta foi encerrada e faturada.',
		actionDescription:
			'Login into Admin Dashboard to make sure the data integrity is OK'
	},
	{
		id: '2',
		date: '2024-11-29T10:00:00',
		title: 'Acórdão Apelação',
		referenceNumber: '#7979207',
		description: 'Documento adicionado ao processo',
		responsible: 'Dr. Carlos Mendes',
		type: 'message',
		addedBy: {
			name: 'Carlos Mendes',
			avatar: 'https://i.pravatar.cc/150?img=3'
		},
		category: ['Recursal', 'Interno']
	},
	{
		id: '3',
		date: '2024-11-29T09:30:00',
		title: 'Bônus por improcedência',
		referenceNumber: '#7966690',
		description: 'Solicitado encerramento',
		responsible: 'Maria Santos',
		type: 'message',
		addedBy: {
			name: 'Maria Santos',
			avatar: 'https://i.pravatar.cc/150?img=5'
		},
		category: ['Execução Definitiva', 'Interno']
	},
	{
		id: '4',
		date: '2024-11-29T08:00:00',
		title: '2 novos arquivos vinculados ao processo',
		description: 'Documentos anexados',
		responsible: 'João Pedro',
		type: 'attachment',
		addedBy: {
			name: 'João Pedro',
			avatar: 'https://i.pravatar.cc/150?img=8'
		},
		documents: [
			{
				id: 'doc1',
				name: 'Finance KPI App Guidelines',
				type: 'pdf',
				size: '2.5 MB'
			},
			{
				id: 'doc2',
				name: 'Brand Book - Webpixels',
				type: 'doc',
				size: '1.8 MB'
			}
		]
	}
]

const getIconForType = (type: string) => {
	switch (type) {
		case 'edit':
			return Edit3
		case 'message':
			return MessageSquare
		case 'attachment':
			return Link2Off
		default:
			return FileText
	}
}

const getIconBgColor = (type: string) => {
	switch (type) {
		case 'edit':
			return 'bg-gray-100'
		case 'message':
			return 'bg-gray-100'
		case 'attachment':
			return 'bg-gray-100'
		default:
			return 'bg-gray-100'
	}
}

interface ProcessTimelineProps {
	folderId: string
}

export function ProcessTimeline({folderId: _folderId}: ProcessTimelineProps) {
	const events = mockTimelineEvents // In real app, fetch based on folderId

	return (
		<div className='bg-white rounded-lg'>
			{/* Header */}
			<div className='border-b border-gray-200'>
				<div className='px-6 py-4'>
					<h3 className='text-lg font-semibold text-gray-900'>Histórico</h3>
				</div>
			</div>

			{/* Timeline */}
			<div className='p-6'>
				<div className='relative'>
					{/* Vertical line */}
					<div className='absolute left-8 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-300' />

					{/* Events */}
					<div className='space-y-6'>
						{events.map((event, _index) => {
							const Icon = getIconForType(event.type || '')
							const iconBg = getIconBgColor(event.type || '')
							const eventDate = DateTime.fromISO(event.date)

							return (
								<div className='flex gap-4' key={event.id}>
									{/* Icon */}
									<div
										className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}
									>
										<Icon className='h-6 w-6 text-gray-600' />
									</div>

									{/* Content */}
									<div className='flex-1 pb-6'>
										{/* Title and Reference */}
										<div className='flex items-start justify-between'>
											<div>
												<div className='flex items-center gap-2'>
													<h4 className='text-base font-medium text-gray-900'>
														{event.title}
													</h4>
													{event.referenceNumber && (
														<span className='text-sm text-cyan-600'>
															{event.referenceNumber}
														</span>
													)}
												</div>

												{/* Added by info */}
												<div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
													<span>
														Adicionado {eventDate.toFormat('dd/MM/yyyy')} por
													</span>
													<div className='flex items-center gap-1'>
														<img
															alt={event.addedBy.name}
															className='h-5 w-5 rounded-full'
															height={20}
															src={
																event.addedBy.avatar ||
																`https://ui-avatars.com/api/?name=${encodeURIComponent(event.addedBy.name)}`
															}
															width={20}
														/>
													</div>
												</div>
											</div>
										</div>

										{/* Special content for success status */}
										{event.status === 'success' && event.actionText && (
											<div className='mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4'>
												<div className='flex items-start gap-3'>
													<div className='flex h-8 w-8 items-center justify-center rounded-full bg-white'>
														<div className='flex h-5 w-5 items-center justify-center'>
															<div className='h-2 w-2 rounded-full bg-green-500' />
															<div className='ml-0.5 h-2 w-2 rounded-full bg-green-500' />
														</div>
													</div>
													<div className='flex-1'>
														<p className='text-sm font-medium text-gray-900'>
															{event.actionText}
														</p>
														<p className='mt-1 text-xs text-gray-500'>
															{event.actionDescription}
														</p>
													</div>
													<button
														className='rounded-full bg-cyan-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-cyan-600'
														type='button'
													>
														Proceed
													</button>
												</div>
											</div>
										)}

										{/* Categories and Action */}
										{event.category && (
											<div className='mt-3 rounded-lg border border-gray-200 p-4'>
												<div className='flex items-center justify-between'>
													<div className='flex items-center gap-4'>
														<span className='text-sm font-medium text-gray-900'>
															{event.description}
														</span>
														<div className='flex gap-2'>
															{event.category.map(cat => (
																<span
																	className='rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700'
																	key={cat}
																>
																	{cat}
																</span>
															))}
														</div>
													</div>
													<button
														className='rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200'
														type='button'
													>
														Visualizar
													</button>
												</div>
											</div>
										)}

										{/* Documents */}
										{event.documents && event.documents.length > 0 && (
											<div className='mt-3 space-y-2'>
												{event.documents.map(doc => (
													<div
														className='flex items-center justify-between rounded-lg border border-gray-200 p-3'
														key={doc.id}
													>
														<div className='flex items-center gap-3'>
															<div className='flex h-10 w-10 items-center justify-center'>
																{doc.type === 'pdf' ? (
																	<div className='relative h-8 w-6'>
																		<div className='absolute inset-0 rounded bg-red-500' />
																		<div className='absolute inset-x-1 bottom-1 flex items-center justify-center'>
																			<span className='text-[8px] font-bold text-white'>
																				PDF
																			</span>
																		</div>
																	</div>
																) : (
																	<FileText className='h-6 w-6 text-blue-500' />
																)}
															</div>
															<div>
																<p className='text-sm font-medium text-gray-900'>
																	{doc.name}
																</p>
																<p className='text-xs text-gray-500'>
																	{doc.size}
																</p>
															</div>
														</div>
														<div className='flex gap-2'>
															<button
																className='rounded p-1.5 hover:bg-gray-100'
																type='button'
															>
																<Eye className='h-4 w-4 text-gray-500' />
															</button>
															<button
																className='rounded p-1.5 hover:bg-gray-100'
																type='button'
															>
																<Download className='h-4 w-4 text-gray-500' />
															</button>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
