import {faker} from '@faker-js/faker'
import {generateAvatar} from '@shared/utils/generate-avatar'

const notificationTemplates = [
	'Nova atualização no processo',
	'Prazo judicial se aproximando',
	'Documento aprovado pelo cliente',
	'Reunião agendada para amanhã',
	'Audiência confirmada',
	'Novo comentário na pasta',
	'Pagamento recebido',
	'Contrato assinado digitalmente'
]

export const notifications = {
	unread: faker.number.int({min: 1, max: 10}),
	items: Array.from({length: 5}, () => ({
		id: faker.string.uuid(),
		avatar: generateAvatar(),
		title: faker.helpers.arrayElement(notificationTemplates),
		time: faker.date.recent()
	}))
}
