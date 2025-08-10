import * as v from 'valibot'
import type {ApiResponse, ErrorResponse} from '../types/api'
import type {User} from '../types/domain'

const AuthSchema = v.object({
	email: v.string(),
	password: v.string()
})
export type AuthInput = v.InferOutput<typeof AuthSchema>

interface LoginResponse {
	user: User
	token: string
}

export async function login(data: AuthInput): Promise<LoginResponse> {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = (await response.json()) as ErrorResponse
		throw new Error(error.errors[0]?.message || 'Login failed')
	}

	const result = (await response.json()) as ApiResponse<LoginResponse>
	return result.data
}

export async function logout(): Promise<void> {
	await fetch('/api/auth/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getStoredToken()}`
		}
	})

	// Clear the stored token
	clearStoredToken()
}

export async function getMe(): Promise<User> {
	const response = await fetch('/api/auth/me', {
		headers: {
			Authorization: `Bearer ${getStoredToken()}`
		}
	})

	if (!response.ok) {
		throw new Error('Unauthorized')
	}

	const result = (await response.json()) as ApiResponse<User>
	return result.data
}

function getStoredToken(): string {
	// TODO: implement function to get token from storage
	// This is a mock function, in a real app you would retrieve the token from localStorage or cookies
	return 'mock-jwt-token'
}

function clearStoredToken(): void {
	// TODO: implement function to clear token from storage
	// This is a mock function, in a real app you would clear the token from localStorage or cookies
	// localStorage.removeItem('token')
	// or
	// document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	// For this mock, we do nothing
}
