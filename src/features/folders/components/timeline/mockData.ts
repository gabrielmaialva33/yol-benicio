import type {TimelineEventData} from './types'

export const mockTimelineEvents: TimelineEventData[] = [
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
