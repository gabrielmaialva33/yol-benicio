import {useCallback, useEffect, useMemo, useState} from 'react'
import {
	login as apiLogin,
	logout as apiLogout,
	clearStoredToken,
	getMe,
	getStoredRefreshToken,
	getStoredToken
} from '../api/auth'
import type {User} from '../types/domain'
import {AuthContext, type AuthContextValue} from './auth-context'

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = useState<User | null>(null)
	const [token, setToken] = useState<string | null>(getStoredToken())
	const [refreshToken, setRefreshToken] = useState<string | null>(
		getStoredRefreshToken()
	)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadUser = async () => {
			if (!token) {
				setLoading(false)
				return
			}
			// Don't fetch if we already have user data
			if (user) {
				setLoading(false)
				return
			}
			try {
				const me = await getMe()
				setUser(me)
			} catch {
				// token inválido
				clearStoredToken()
				setToken(null)
				setUser(null)
			} finally {
				setLoading(false)
			}
		}
		void loadUser()
	}, [token, user])

	const login = useCallback(async (email: string, password: string) => {
		setError(null)
		setLoading(true)
		try {
			const response = await apiLogin(email, password)
			// Response includes user data and auth tokens
			const userData: User = {
				id: response.id,
				full_name: response.full_name,
				email: response.email,
				username: response.username,
				user_type: response.user_type,
				roles: response.roles,
				metadata: response.metadata,
				created_at: response.created_at,
				updated_at: response.updated_at,
				deleted_at: response.deleted_at,
				is_deleted: response.is_deleted
			}
			setUser(userData)
			setToken(response.auth.access_token)
			setRefreshToken(response.auth.refresh_token)
		} catch (e) {
			setError((e as Error).message)
			throw e
		} finally {
			setLoading(false)
		}
	}, [])

	const logout = useCallback(async () => {
		setLoading(true)
		try {
			await apiLogout()
			setUser(null)
			setToken(null)
			setRefreshToken('')
		} finally {
			setLoading(false)
		}
	}, [])

	const refresh = useCallback(async () => {
		if (!token) return
		try {
			const me = await getMe()
			setUser(me)
		} catch {
			clearStoredToken()
			setToken(null)
			setUser(null)
		}
	}, [token])

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			token,
			refreshToken,
			login,
			logout,
			loading,
			error,
			refresh,
			isAuthenticated: Boolean(user && token)
		}),
		[user, token, refreshToken, login, logout, loading, error, refresh]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
