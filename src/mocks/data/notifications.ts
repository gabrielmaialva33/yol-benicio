import {faker} from '@faker-js/faker'
import {generateAvatar} from '@shared/utils/generate-avatar'

export const notifications = {
	unread: faker.number.int({min: 1, max: 10}),
	items: Array.from({length: 5}, () => ({
		id: faker.string.uuid(),
		avatar: generateAvatar(),
		title: faker.lorem.words({min: 3, max: 5}),
		time: faker.date.recent()
	}))
}
