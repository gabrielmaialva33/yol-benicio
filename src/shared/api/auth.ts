import { API_BASE_URL } from '../../config/api'
import type { ErrorResponse } from '../types/api'
import type { User, AuthResponse } from '../types/domain'

// Storage keys
const ACCESS_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

function isBrowser() {
	return (
		typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
	)
}

export async function login(email: string, password: string): Promise<AuthResponse> {
	const response = await fetch(`${API_BASE_URL}/api/v1/sessions/sign-in`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({
			uid: email, // backend accepts uid (email or username)
			password: password
		})
	})

	if (!response.ok) {
		const error = await response.json() as ErrorResponse
		throw new Error(error.errors?.[0]?.message || 'Falha no login')
	}

	const data = await response.json() as AuthResponse

	// Save tokens
	if (data.auth?.access_token) {
		setStoredToken(data.auth.access_token)
	}
	if (data.auth?.refresh_token) {
		setStoredRefreshToken(data.auth.refresh_token)
	}

	return data
}

export async function logout(): Promise<void> {
	const token = getStoredToken()

	try {
		if (token) {
			await fetch(`${API_BASE_URL}/api/v1/sessions/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				credentials: 'include'
			})
		}
	} catch {
		// Ignore network errors on logout
	} finally {
		clearStoredToken()
	}
}

export async function getMe(): Promise<User> {
	const token = getStoredToken()
	if (!token) {
		throw new Error('Não autenticado')
	}

	const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	})

	if (!response.ok) {
		if (response.status === 401) {
			clearStoredToken()
			throw new Error('Token expirado ou inválido')
		}
		throw new Error('Erro ao buscar dados do usuário')
	}

	const user = await response.json() as User
	return user
}

export async function refreshToken(): Promise<string> {
	const refresh = getStoredRefreshToken()
	if (!refresh) {
		throw new Error('No refresh token available')
	}

	const response = await fetch(`${API_BASE_URL}/api/v1/sessions/refresh`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${refresh}`,
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	})

	if (!response.ok) {
		clearStoredToken()
		throw new Error('Failed to refresh token')
	}

	const data = await response.json()

	if (data.access_token) {
		setStoredToken(data.access_token)
		if (data.refresh_token) {
			setStoredRefreshToken(data.refresh_token)
		}
		return data.access_token
	}

	throw new Error('No access token in refresh response')
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