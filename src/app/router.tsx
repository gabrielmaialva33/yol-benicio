import {lazy, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router'
import {ProtectedRoute} from '@shared/components/ProtectedRoute'

const LoginPage = lazy(() =>
	import('../features/auth').then(m => ({default: m.LoginPage}))
)
const Dashboard = lazy(() =>
	import('../features/dashboard').then(m => ({default: m.Dashboard}))
)
const DashboardContent = lazy(() =>
	import('../features/dashboard/components/DashboardContent').then(m => ({
		default: m.DashboardContent
	}))
)
const FolderConsultationPage = lazy(() =>
	import('../features/folders/pages/FolderConsultationPage').then(m => ({
		default: m.FolderConsultationPage
	}))
)
const FolderDetailPage = lazy(() =>
	import('../features/folders/components/FolderDetailPage').then(m => ({
		default: m.FolderDetailPage
	}))
)
const FolderRegisterPage = lazy(() =>
	import('../features/folders/pages/FolderRegisterPage').then(m => ({
		default: m.FolderRegisterPage
	}))
)

export function AppRouter() {
	return (
		<Suspense
			fallback={
				<main>
					<div data-testid='loading'>Loading...</div>
				</main>
			}
		>
			<Routes>
				<Route element={<LoginPage />} index={true} />
				<Route
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
					path='/dashboard'>
					<Route element={<DashboardContent />} index={true} />
					<Route
						element={<FolderConsultationPage />}
						path='folders/consultation'
					/>
					<Route
						element={<FolderDetailPage />}
						path='folders/consultation/:folderId'
					/>
					<Route element={<FolderRegisterPage />} path='folders/register' />
				</Route>
				{/* Catch-all route that redirects to home */}
				<Route element={<Navigate replace={true} to='/' />} path='*' />
			</Routes>
		</Suspense>
	)
}
