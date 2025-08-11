import {createContext, useContext} from 'react'
import type {AuthState} from '../api/auth'

export interface AuthContextValue extends AuthState {
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
