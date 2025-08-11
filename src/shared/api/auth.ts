import {z} from 'zod'
import type {ApiResponse, ErrorResponse} from '../types/api'
import type {User} from '../types/domain'

const MIN_PASSWORD_LENGTH = 6

const AuthSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z
		.string()
		.min(MIN_PASSWORD_LENGTH, 'Senha deve ter no mínimo 6 caracteres')
})
export type AuthInput = z.infer<typeof AuthSchema>

interface LoginResponse {
	user: User
	token: string
	refreshToken?: string | undefined
}

// Storage keys
const ACCESS_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

function isBrowser() {
	return (
		typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
	)
}

export async function login(data: AuthInput): Promise<LoginResponse> {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		throw new Error(await extractErrorMessage(response))
	}

	const raw = (await response.json()) as unknown
	const result = normalizeLoginResponse(raw)
	if (result.token) {
		setStoredToken(result.token)
	}
	if (result.refreshToken) {
		setStoredRefreshToken(result.refreshToken)
	}
	return result
}

async function extractErrorMessage(r: Response): Promise<string> {
	try {
		const error = (await r.json()) as ErrorResponse
		return error.errors[0]?.message || 'Login failed'
	} catch {
		return 'Login failed'
	}
}

function extractTokenLike(
	obj: Record<string, unknown>,
	key: 'access_token' | 'token'
): string {
	const auth = (obj.auth as Record<string, unknown>) || {}
	const direct = key === 'access_token' ? auth.access_token : obj[key]
	return typeof direct === 'string' ? (direct as string) : ''
}

function extractRefreshToken(obj: Record<string, unknown>): string | undefined {
	const auth = (obj.auth as Record<string, unknown>) || {}
	if (typeof auth.refresh_token === 'string') {
		return auth.refresh_token as string
	}
	if (typeof obj.refresh_token === 'string') {
		return obj.refresh_token as string
	}
}

function normalizeLoginResponse(raw: unknown): LoginResponse {
	const obj = (raw || {}) as Record<string, unknown>
	const token =
		extractTokenLike(obj, 'access_token') || extractTokenLike(obj, 'token')
	const refreshToken = extractRefreshToken(obj)

	const roles = Array.isArray(obj.roles) ? (obj.roles as User['roles']) : []
	const now = new Date().toISOString()
	const fullName =
		(obj.full_name as string) || (obj.name as string) || 'Usuário'
	const avatar = (obj.avatar_url as string) || (obj.avatarUrl as string) || ''
	const email = String(obj.email || 'unknown@example.com')
	const username = (obj.username as string) || email.split('@')[0] || 'user'
	const metadataSource = (obj.metadata as Record<string, unknown>) || {}

	const user: User = {
		id: Number(obj.id ?? 0),
		full_name: fullName,
		email,
		username,
		avatar_url: avatar,
		metadata: {
			email_verified: Boolean(metadataSource.email_verified ?? true),
			email_verified_at: (metadataSource.email_verified_at as string) || null,
			last_login_at: now
		},
		roles,
		created_at: (obj.created_at as string) || now,
		updated_at: (obj.updated_at as string) || now
	}

	return {user, token, refreshToken}
}

export async function logout(): Promise<void> {
	try {
		await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getStoredToken()}`
			}
		})
	} catch {
		// ignorar erros de rede no logout
	} finally {
		clearStoredToken()
	}
}

export async function getMe(): Promise<User> {
	const token = getStoredToken()
	if (!token) {
		throw new Error('Unauthorized')
	}
	const response = await fetch('/api/auth/me', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	if (!response.ok) {
		throw new Error('Unauthorized')
	}

	const result = (await response.json()) as ApiResponse<User>
	return result.data
}

export function getStoredToken(): string | null {
	if (!isBrowser()) {
		return null
	}
	return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredRefreshToken(): string | null {
	if (!isBrowser()) {
		return null
	}
	return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setStoredToken(token: string): void {
	if (!isBrowser()) {
		return
	}
	window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function setStoredRefreshToken(token: string): void {
	if (!isBrowser()) {
		return
	}
	window.localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function clearStoredToken(): void {
	if (!isBrowser()) {
		return
	}
	window.localStorage.removeItem(ACCESS_TOKEN_KEY)
	window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
	return Boolean(getStoredToken())
}

export interface AuthState {
	user: User | null
	token: string | null
	refreshToken?: string
}
