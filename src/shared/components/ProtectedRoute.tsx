import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../hooks/use-auth-hook'

export interface ProtectedRouteProps {
	children: React.ReactNode
	fallback?: string
}

export function ProtectedRoute({ children, fallback = '/' }: ProtectedRouteProps) {
	const { isAuthenticated, loading } = useAuth()
	const location = useLocation()

	// Show loading state while checking authentication
	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="text-muted-foreground">Carregando...</p>
				</div>
			</div>
		)
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		// Save the attempted location for redirecting after login
		return <Navigate to={fallback} state={{ from: location }} replace />
	}

	// Render protected content
	return <>{children}</>
}

export default ProtectedRoute