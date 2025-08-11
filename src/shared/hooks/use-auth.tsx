import {useCallback, useEffect, useMemo, useState} from 'react'
import {
	type AuthState,
	login as apiLogin,
	logout as apiLogout,
	clearStoredToken,
	getMe,
	getStoredToken
} from '../api/auth'
import {AuthContext, type AuthContextValue} from './auth-context'

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = useState<AuthState['user']>(null)
	const [token, setToken] = useState<string | null>(getStoredToken())
	const [refreshToken, setRefreshToken] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const loadUser = useCallback(async () => {
		if (!token) {
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
		} finally {
			setLoading(false)
		}
	}, [token])

	useEffect(() => {
		void loadUser()
	}, [loadUser])

	const login = useCallback(async (email: string, password: string) => {
		setError(null)
		setLoading(true)
		try {
			const {
				user: loggedUser,
				token: tk,
				refreshToken: rtk
			} = await apiLogin({email, password})
			setUser(loggedUser)
			setToken(tk)
			setRefreshToken(rtk || '')
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
		await loadUser()
	}, [loadUser])

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
