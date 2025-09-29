import {DateTime} from 'luxon'
import {HttpResponse, http} from 'msw'
import type {User} from '../../shared/types/domain'
import {generateUsers} from '../generators/users'
import {
	applyFilters,
	applySorting,
	createPaginatedResponse,
	parseQueryParams
} from '../helpers/pagination'

// Generate mock user data
const TOTAL_USERS = 50
const allUsers = generateUsers(TOTAL_USERS)

// Filter functions
const userFilters = {
	search: (user: User, value: string) => {
		const searchLower = value.toLowerCase()
		return (
			user.full_name.toLowerCase().includes(searchLower) ||
			user.email.toLowerCase().includes(searchLower) ||
			user.username?.toLowerCase().includes(searchLower)
		)
	},
	role: (user: User, value: string) => user.roles.some(r => r.slug === value)
}

// Adonis v6 user format
interface AdonisUser extends User {
	metadata: {
		email_verified: boolean
		email_verified_at: string | null
		email_verification_token: string
		email_verification_sent_at: string
	}
	created_at: string
	updated_at: string
	roles: Array<{
		id: number
		name: string
		description: string | null
		slug: string
		created_at: string
		updated_at: string
	}>
}

function transformToAdonisUser(user: User): AdonisUser {
	const now = DateTime.now()
	const MAX_DAYS_AGO = 30
	const MAX_DAYS_AGO_CREATED = 365
	const MAX_DAYS_AGO_UPDATED = 7
	const randomDaysAgo = Math.floor(Math.random() * MAX_DAYS_AGO)
	const randomDaysAgoCreated = Math.floor(Math.random() * MAX_DAYS_AGO_CREATED)
	const randomDaysAgoUpdated = Math.floor(Math.random() * MAX_DAYS_AGO_UPDATED)

	const userRole = user.roles?.[0]?.slug ?? 'user'
	const getRoleInfo = (role: string) => {
		if (role === 'admin') {
			return {id: 1, name: 'Admin'}
		}
		if (role === 'lawyer') {
			return {id: 2, name: 'Lawyer'}
		}
		return {id: 3, name: 'User'}
	}
	const roleInfo = getRoleInfo(userRole)

	return {
		...user,
		username: user.username || user.email.split('@')[0] || '',
		metadata: {
			email_verified: true,
			email_verified_at: now.minus({days: randomDaysAgo}).toISO(),
			email_verification_token: '',
			email_verification_sent_at: now.minus({days: randomDaysAgo}).toISO()
		},
		created_at: now.minus({days: randomDaysAgoCreated}).toISO(),
		updated_at: now.minus({days: randomDaysAgoUpdated}).toISO(),
		roles: [
			{
				...roleInfo,
				description: null,
				slug: userRole,
				created_at: now.minus({days: 90}).toISO(),
				updated_at: now.minus({days: 90}).toISO()
			}
		]
	}
}

export const userHandlers = [
	// List users with pagination - Adonis v6 format
	http.get('/api/users', ({request}) => {
		const url = new URL(request.url)
		const {page, perPage, sortBy, order, filters} = parseQueryParams(url)

		let filteredUsers = applyFilters(allUsers, filters, userFilters)
		filteredUsers = applySorting(filteredUsers, sortBy, order)

		// Transform to Adonis format
		const adonisUsers = filteredUsers.map(transformToAdonisUser)

		const response = createPaginatedResponse({
			data: adonisUsers,
			page,
			perPage,
			baseUrl: '/api/users'
		})

		return HttpResponse.json(response)
	}),

	// Get user by ID
	http.get('/api/users/:id', ({params}) => {
		const {id} = params
		const user = allUsers.find(u => u.id === Number(id))

		if (!user) {
			return HttpResponse.json(
				{errors: [{message: 'User not found'}]},
				{status: 404}
			)
		}

		const adonisUser = transformToAdonisUser(user)
		return HttpResponse.json(adonisUser)
	}),

	// Create new user
	http.post('/api/users', async ({request}) => {
		const body = (await request.json()) as Partial<User>
		const now = DateTime.now()

		const newUser: User = {
			...body,
			id: Math.max(...allUsers.map(u => u.id)) + 1,
			avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
				body.full_name || ''
			)}&background=random`,
			created_at: now.toISO(),
			updated_at: now.toISO()
		} as User

		allUsers.push(newUser)

		const adonisUser = transformToAdonisUser(newUser)
		return HttpResponse.json(adonisUser, {status: 201})
	}),

	// Update user
	http.put('/api/users/:id', async ({params, request}) => {
		const {id} = params
		const body = (await request.json()) as Partial<User>
		const now = DateTime.now()

		const userIndex = allUsers.findIndex(u => u.id === Number(id))
		if (userIndex === -1) {
			return HttpResponse.json(
				{errors: [{message: 'User not found'}]},
				{status: 404}
			)
		}

		const existingUser = allUsers[userIndex]
		const updatedUser: User = {
			...existingUser,
			...body,
			updated_at: now.toISO()
		} as User

		allUsers[userIndex] = updatedUser

		const adonisUser = transformToAdonisUser(updatedUser)
		return HttpResponse.json(adonisUser)
	}),

	// Delete user
	http.delete('/api/users/:id', ({params}) => {
		const {id} = params
		const userIndex = allUsers.findIndex(u => u.id === Number(id))

		if (userIndex === -1) {
			return HttpResponse.json(
				{errors: [{message: 'User not found'}]},
				{status: 404}
			)
		}

		allUsers.splice(userIndex, 1)
		return new HttpResponse(null, {status: 204})
	})
]
