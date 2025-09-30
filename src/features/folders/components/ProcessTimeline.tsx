import {
	AlertCircle,
	Bell,
	CheckCircle,
	Clock,
	Download,
	Edit3,
	Eye,
	FileText,
	Gavel,
	Paperclip,
	Scale,
	TrendingUp,
	UserPlus,
	X
} from 'lucide-react'
import {DateTime} from 'luxon'
import type {FolderMovement} from '../types/folder.types'

// String constants
const LABEL_HISTORY = 'Histórico'
const LABEL_SEARCH = 'Buscar'
const LABEL_ADDED_BY = 'Adicionado'
const LABEL_BY = 'por'
const LABEL_CONTINUE = 'Continuar'
const LABEL_RESOLVE = 'Resolver'
const LABEL_VIEW = 'Visualizar'
const LABEL_PDF = 'PDF'
const CATEGORY_FAVORABLE = 'favorável'
const CATEGORY_HEARING = 'audiência'
const CATEGORY_SCHEDULED = 'agendada'

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
	status?: 'success' | 'info' | 'warning' | 'error' | 'neutral'
	actionText?: string
	actionDescription?: string
	eventType?:
		| 'billing'
		| 'document'
		| 'hearing'
		| 'decision'
		| 'party'
		| 'update'
		| 'deadline'
		| 'attachment'
}

// Mock data with more realistic legal events
const mockTimelineEvents: TimelineEvent[] = [
	{
		id: '1',
		date: '2024-11-29T14:30:00',
		title: 'Faturamento realizado com sucesso',
		description: 'A pasta foi encerrada e faturada.',
		responsible: 'Sistema',
		type: 'edit',
		eventType: 'billing',
		addedBy: {
			name: 'Ana Silva',
			avatar: 'https://i.pravatar.cc/150?img=1'
		},
		status: 'success',
		actionText: 'A pasta foi encerrada e faturada.',
		actionDescription:
			'Acesse o painel administrativo para verificar os detalhes do faturamento'
	},
	{
		id: '2',
		date: '2024-11-29T10:00:00',
		title: 'Acórdão Apelação',
		referenceNumber: '#7979207',
		description: 'Decisão favorável em segunda instância',
		responsible: 'Dr. Carlos Mendes',
		type: 'message',
		eventType: 'decision',
		addedBy: {
			name: 'Carlos Mendes',
			avatar: 'https://i.pravatar.cc/150?img=3'
		},
		category: ['Recursal', 'Favorável'],
		status: 'info'
	},
	{
		id: '3',
		date: '2024-11-29T09:30:00',
		title: 'Audiência de Conciliação',
		referenceNumber: '#7966690',
		description: 'Audiência agendada para 15/12/2024',
		responsible: 'Maria Santos',
		type: 'message',
		eventType: 'hearing',
		addedBy: {
			name: 'Maria Santos',
			avatar: 'https://i.pravatar.cc/150?img=5'
		},
		category: ['Audiência', 'Agendada'],
		status: 'warning'
	},
	{
		id: '4',
		date: '2024-11-29T08:00:00',
		title: '2 novos documentos anexados',
		description: 'Petição inicial e procuração',
		responsible: 'João Pedro',
		type: 'attachment',
		eventType: 'attachment',
		addedBy: {
			name: 'João Pedro',
			avatar: 'https://i.pravatar.cc/150?img=8'
		},
		documents: [
			{
				id: 'doc1',
				name: 'Petição Inicial - Ação Ordinária',
				type: 'pdf',
				size: '2.5 MB'
			},
			{
				id: 'doc2',
				name: 'Procuração Ad Judicia',
				type: 'doc',
				size: '450 KB'
			}
		]
	},
	{
		id: '5',
		date: '2024-11-28T16:45:00',
		title: 'Novo polo passivo adicionado',
		description: 'Empresa XYZ Ltda incluída como ré',
		responsible: 'Sistema',
		type: 'edit',
		eventType: 'party',
		addedBy: {
			name: 'Pedro Lima',
			avatar: 'https://i.pravatar.cc/150?img=10'
		},
		status: 'neutral'
	},
	{
		id: '6',
		date: '2024-11-28T14:00:00',
		title: 'Prazo processual',
		description: 'Prazo para contestação - 15 dias',
		responsible: 'Sistema',
		type: 'edit',
		eventType: 'deadline',
		addedBy: {
			name: 'Sistema',
			avatar: ''
		},
		status: 'error',
		actionText: 'Prazo expira em 15/12/2024',
		actionDescription:
			'Certifique-se de protocolar a contestação dentro do prazo legal'
	}
]

// Event type configuration with icons and colors
const eventTypeConfig = {
	billing: {
		icon: TrendingUp,
		iconBg: 'bg-green-100',
		iconColor: 'text-green-600',
		borderColor: 'border-green-200'
	},
	document: {
		icon: FileText,
		iconBg: 'bg-blue-100',
		iconColor: 'text-blue-600',
		borderColor: 'border-blue-200'
	},
	hearing: {
		icon: Gavel,
		iconBg: 'bg-amber-100',
		iconColor: 'text-amber-600',
		borderColor: 'border-amber-200'
	},
	decision: {
		icon: Scale,
		iconBg: 'bg-purple-100',
		iconColor: 'text-purple-600',
		borderColor: 'border-purple-200'
	},
	party: {
		icon: UserPlus,
		iconBg: 'bg-indigo-100',
		iconColor: 'text-indigo-600',
		borderColor: 'border-indigo-200'
	},
	update: {
		icon: Edit3,
		iconBg: 'bg-gray-100',
		iconColor: 'text-gray-600',
		borderColor: 'border-gray-200'
	},
	deadline: {
		icon: Clock,
		iconBg: 'bg-red-100',
		iconColor: 'text-red-600',
		borderColor: 'border-red-200'
	},
	attachment: {
		icon: Paperclip,
		iconBg: 'bg-cyan-100',
		iconColor: 'text-cyan-600',
		borderColor: 'border-cyan-200'
	}
}

const getEventConfig = (eventType?: string) =>
	eventTypeConfig[eventType as keyof typeof eventTypeConfig] ||
	eventTypeConfig.update

const getStatusIcon = (status?: string) => {
	switch (status) {
		case 'success':
			return CheckCircle
		case 'warning':
			return AlertCircle
		case 'error':
			return X
		case 'info':
			return Bell
		default:
			return null
	}
}

const getStatusColors = (status?: string) => {
	switch (status) {
		case 'success':
			return {
				bg: 'bg-green-50',
				border: 'border-green-200',
				text: 'text-green-900',
				subtext: 'text-green-700',
				button: 'bg-green-600 hover:bg-green-700',
				iconBg: 'bg-green-100',
				iconColor: 'text-green-600'
			}
		case 'warning':
			return {
				bg: 'bg-amber-50',
				border: 'border-amber-200',
				text: 'text-amber-900',
				subtext: 'text-amber-700',
				button: 'bg-amber-600 hover:bg-amber-700',
				iconBg: 'bg-amber-100',
				iconColor: 'text-amber-600'
			}
		case 'error':
			return {
				bg: 'bg-red-50',
				border: 'border-red-200',
				text: 'text-red-900',
				subtext: 'text-red-700',
				button: 'bg-red-600 hover:bg-red-700',
				iconBg: 'bg-red-100',
				iconColor: 'text-red-600'
			}
		default:
			return null
	}
}

interface ProcessTimelineProps {
	folderId: string
}

export function ProcessTimeline({folderId: _folderId}: ProcessTimelineProps) {
	const events = mockTimelineEvents // In real app, fetch based on folderId

	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
			{/* Header with Search */}
			<div className='px-6 py-4 border-b border-gray-100'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-semibold text-gray-900'>
						{LABEL_HISTORY}
					</h2>
					<div className='relative w-64'>
						<input
							className='w-full pl-4 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]'
							placeholder={LABEL_SEARCH}
							type='text'
						/>
					</div>
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
							const config = getEventConfig(event.eventType)
							const Icon = config.icon
							const statusColors = getStatusColors(event.status)
							const StatusIcon = getStatusIcon(event.status)
							const eventDate = DateTime.fromISO(event.date)

							return (
								<div className='flex gap-4' key={event.id}>
									{/* Icon */}
									<div
										className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${config.iconBg} border-2 ${config.borderColor}`}
									>
										<Icon className={`h-6 w-6 ${config.iconColor}`} />
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
														{LABEL_ADDED_BY} {eventDate.toFormat('dd/MM/yyyy')}{' '}
														{LABEL_BY}
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

										{/* Status cards with actions */}
										{statusColors && event.actionText && (
											<div
												className={`mt-3 rounded-lg ${statusColors.bg} border ${statusColors.border} p-4`}
											>
												<div className='flex items-start gap-3'>
													{StatusIcon && (
														<div
															className={`flex h-8 w-8 items-center justify-center rounded-full ${statusColors.iconBg}`}
														>
															<StatusIcon
																className={`h-5 w-5 ${statusColors.iconColor}`}
															/>
														</div>
													)}
													<div className='flex-1'>
														<p
															className={`text-sm font-medium ${statusColors.text}`}
														>
															{event.actionText}
														</p>
														{event.actionDescription && (
															<p
																className={`mt-1 text-xs ${statusColors.subtext}`}
															>
																{event.actionDescription}
															</p>
														)}
													</div>
													{event.status === 'success' && (
														<button
															className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors ${statusColors.button}`}
															type='button'
														>
															{LABEL_CONTINUE}
														</button>
													)}
													{event.status === 'error' && (
														<button
															className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-colors ${statusColors.button}`}
															type='button'
														>
															{LABEL_RESOLVE}
														</button>
													)}
												</div>
											</div>
										)}

										{/* Categories and Action */}
										{event.category && !statusColors && (
											<div className='mt-3 rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors'>
												<div className='flex items-center justify-between'>
													<div className='flex-1'>
														<p className='text-sm font-medium text-gray-900 mb-2'>
															{event.description}
														</p>
														<div className='flex flex-wrap gap-2'>
															{event.category.map(cat => {
																const isPositive = cat
																	.toLowerCase()
																	.includes(CATEGORY_FAVORABLE)
																const isWarning =
																	cat
																		.toLowerCase()
																		.includes(CATEGORY_HEARING) ||
																	cat.toLowerCase().includes(CATEGORY_SCHEDULED)

																let badgeClasses = 'bg-gray-100 text-gray-700'
																if (isPositive) {
																	badgeClasses = 'bg-green-100 text-green-700'
																} else if (isWarning) {
																	badgeClasses = 'bg-amber-100 text-amber-700'
																}

																return (
																	<span
																		className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses}`}
																		key={cat}
																	>
																		{cat}
																	</span>
																)
															})}
														</div>
													</div>
													<button
														className='rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors'
														type='button'
													>
														{LABEL_VIEW}
													</button>
												</div>
											</div>
										)}

										{/* Documents */}
										{event.documents && event.documents.length > 0 && (
											<div className='mt-3 space-y-2'>
												{event.documents.map(doc => (
													<div
														className='flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:shadow-sm transition-all'
														key={doc.id}
													>
														<div className='flex items-center gap-3'>
															<div className='flex h-10 w-10 items-center justify-center'>
																{doc.type === 'pdf' ? (
																	<div className='relative h-8 w-6'>
																		<div className='absolute inset-0 rounded bg-red-500' />
																		<div className='absolute inset-x-1 bottom-1 flex items-center justify-center'>
																			<span className='text-[8px] font-bold text-white'>
																				{LABEL_PDF}
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
