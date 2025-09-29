import {createContext, useContext} from 'react'
import type {User} from '../types/domain'

export interface AuthContextValue {
	user: User | null
	token: string | null
	refreshToken: string | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
	loading: boolean
	error: string | null
	refresh: () => Promise<void>
	isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(
	undefined
)

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return ctx
}
