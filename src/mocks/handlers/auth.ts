import {DateTime} from 'luxon'
import {HttpResponse, http} from 'msw'
import type {ApiResponse, ErrorResponse} from '../../shared/types/api'
import type {User} from '../../shared/types/domain'
import {systemUsers} from '../generators/users'

interface LoginRequest {
	email: string
	password: string
}

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
	auth: {
		access_token: string
		refresh_token: string
	}
}

const ROLE_IDS = {
	admin: 1,
	lawyer: 2,
	user: 3
}

const getRoleInfo = (role: 'admin' | 'lawyer' | 'user') => {
	const roleMap = {
		admin: {id: ROLE_IDS.admin, name: 'Admin'},
		lawyer: {id: ROLE_IDS.lawyer, name: 'Lawyer'},
		user: {id: ROLE_IDS.user, name: 'User'}
	}
	return roleMap[role]
}

const getUserRole = (user: User) => {
	const slug = user.roles?.[0]?.slug
	if (slug === 'admin' || slug === 'lawyer') {
		return slug
	}
	return 'user'
}

export const authHandlers = [
	// Login - Adonis v6 format
	http.post('/api/auth/login', async ({request}) => {
		const body = (await request.json()) as LoginRequest

		// Valid credentials
		if (
			body.email === 'test@benicio.com.br' &&
			body.password === 'benicio123'
		) {
			const user = systemUsers.testLawyer
			const now = DateTime.now()

			const adonisUser: AdonisUser = {
				...user,
				metadata: {
					email_verified: true,
					email_verified_at: now.toISO(),
					email_verification_token: '',
					email_verification_sent_at: now.toISO()
				},
				created_at: now.minus({days: 30}).toISO(),
				updated_at: now.toISO(),
				roles: [
					{
						...getRoleInfo(getUserRole(user)),
						description: null,
						slug: getUserRole(user),
						created_at: now.minus({days: 90}).toISO(),
						updated_at: now.minus({days: 90}).toISO()
					}
				],
				auth: {
					access_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MjE5MDY4NywiZXhwIjoxNzUyMTkxNTg3fQ.mN5_LyaxP1nZ46wWjRFVVB26E-0FD9vXJ7J5JlkE8AE',
					refresh_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MjE5MDY4NywiZXhwIjoxNzUyNDQ5ODg3fQ.qvB1tWAt0P8m0yjrJnlThhjmGhvyaCmfEvK7msZAFVM'
				}
			}

			return HttpResponse.json(adonisUser)
		}

		// Invalid credentials
		const errorResponse: ErrorResponse = {
			errors: [
				{
					message: 'E-mail ou senha inválidos',
					field: 'email',
					rule: 'auth'
				}
			]
		}
		return HttpResponse.json(errorResponse, {status: 401})
	}),

	// Alternative sign-in endpoint (same as login)
	http.post('/api/sign-in', async ({request}) => {
		const body = (await request.json()) as LoginRequest

		// Valid credentials
		if (
			body.email === 'test@benicio.com.br' &&
			body.password === 'benicio123'
		) {
			const user = systemUsers.testLawyer
			const now = DateTime.now()

			const adonisUser: AdonisUser = {
				...user,
				metadata: {
					email_verified: true,
					email_verified_at: now.toISO(),
					email_verification_token: '',
					email_verification_sent_at: now.toISO()
				},
				created_at: now.minus({days: 30}).toISO(),
				updated_at: now.toISO(),
				roles: [
					{
						...getRoleInfo(getUserRole(user)),
						description: null,
						slug: getUserRole(user),
						created_at: now.minus({days: 90}).toISO(),
						updated_at: now.minus({days: 90}).toISO()
					}
				],
				auth: {
					access_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MjE5MDY4NywiZXhwIjoxNzUyMTkxNTg3fQ.mN5_LyaxP1nZ46wWjRFVVB26E-0FD9vXJ7J5JlkE8AE',
					refresh_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1MjE5MDY4NywiZXhwIjoxNzUyNDQ5ODg3fQ.qvB1tWAt0P8m0yjrJnlThhjmGhvyaCmfEvK7msZAFVM'
				}
			}

			return HttpResponse.json(adonisUser)
		}

		// Invalid credentials
		const errorResponse: ErrorResponse = {
			errors: [
				{
					message: 'E-mail ou senha inválidos',
					field: 'email',
					rule: 'auth'
				}
			]
		}
		return HttpResponse.json(errorResponse, {status: 401})
	}),

	// Logout
	http.post('/api/auth/logout', () =>
		HttpResponse.json({data: {message: 'Logout successful'}})
	),

	// Me (current user)
	http.get('/api/auth/me', () => {
		const response: ApiResponse<User> = {
			data: systemUsers.testLawyer
		}
		return HttpResponse.json(response)
	}),

	// Refresh token
	http.post('/api/auth/refresh', () => {
		const response: ApiResponse<{token: string}> = {
			data: {
				token: 'new-mock-jwt-token'
			}
		}
		return HttpResponse.json(response)
	}),

	// Forgot password
	http.post('/api/auth/forgot-password', async ({request}) => {
		const body = (await request.json()) as {email: string}

		const response: ApiResponse<{message: string}> = {
			data: {
				message: `If ${body.email} is registered, you will receive password reset instructions.`
			}
		}
		return HttpResponse.json(response)
	}),

	// Reset password
	http.post('/api/auth/reset-password', async ({request}) => {
		const body = (await request.json()) as {token: string; password: string}

		if (body.token === 'valid-reset-token') {
			const response: ApiResponse<{message: string}> = {
				data: {
					message: 'Password reset successfully'
				}
			}
			return HttpResponse.json(response)
		}

		const errorResponse: ErrorResponse = {
			errors: [
				{
					message: 'Invalid or expired token',
					field: 'token',
					rule: 'invalid'
				}
			]
		}
		return HttpResponse.json(errorResponse, {status: 400})
	})
]
