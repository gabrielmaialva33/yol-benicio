import type {ReactNode} from 'react'
import {createContext, useContext, useEffect, useState} from 'react'
import {logout as apiLogout, getMe, getStoredToken} from '../api/auth'
import type {User} from '../types/domain'

export interface AuthContextValue {
	user: User | null
	token: string | null
	isLoading: boolean
	logout: () => Promise<void>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Load token and fetch user data on mount
	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const storedToken = getStoredToken()

				if (!storedToken) {
					setIsLoading(false)
					return
				}

				setToken(storedToken)

				// Fetch user data
				const userData = await getMe()
				setUser(userData)
			} catch {
				setToken(null)
				setUser(null)
			} finally {
				setIsLoading(false)
			}
		}

		initializeAuth()
	}, [])

	const logout = async () => {
		try {
			await apiLogout()
		} catch {
		} finally {
			setUser(null)
			setToken(null)
		}
	}

	const refreshUser = async () => {
		try {
			const userData = await getMe()
			setUser(userData)
		} catch (error) {
			// If refresh fails, clear authentication state
			setUser(null)
			setToken(null)
			throw error
		}
	}

	const value: AuthContextValue = {
		user,
		token,
		isLoading,
		logout,
		refreshUser
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext)

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}

	return context
}
