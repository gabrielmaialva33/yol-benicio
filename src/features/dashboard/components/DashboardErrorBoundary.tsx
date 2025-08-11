import {ErrorBoundary} from '@shared/components/ErrorBoundary'
import {LayoutDashboard, RefreshCw} from 'lucide-react'
import type {ReactNode} from 'react'

interface DashboardErrorBoundaryProps {
	children: ReactNode
	section?: 'widget' | 'sidebar' | 'header' | 'main'
}

/**
 * Error Boundary específico para o Dashboard
 */
export function DashboardErrorBoundary({
	children,
	section = 'main'
}: DashboardErrorBoundaryProps) {
	const getSectionLevel = () => {
		switch (section) {
			case 'widget':
				return 'component' as const
			case 'sidebar':
			case 'header':
				return 'section' as const
			default:
				return 'page' as const
		}
	}

	const getSectionMessage = () => {
		switch (section) {
			case 'widget':
				return 'Este widget não pôde ser carregado'
			case 'sidebar':
				return 'O menu lateral encontrou um problema'
			case 'header':
				return 'O cabeçalho não pôde ser carregado'
			default:
				return 'O dashboard encontrou um problema'
		}
	}

	return (
		<ErrorBoundary
			level={getSectionLevel()}
			isolate={section === 'widget'}
			fallback={(error, reset) => (
				<div
					className={`flex items-center justify-center ${
						section === 'widget'
							? 'h-full min-h-[200px]'
							: section === 'main'
								? 'min-h-screen'
								: 'min-h-[300px]'
					} bg-gray-50 rounded-lg`}
				>
					<div className='text-center p-6'>
						<div className='inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4'>
							<LayoutDashboard className='w-6 h-6 text-orange-600' />
						</div>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							{getSectionMessage()}
						</h3>
						<p className='text-sm text-gray-600 mb-4'>
							{section === 'widget'
								? 'Os dados serão recarregados automaticamente em alguns segundos.'
								: 'Por favor, tente recarregar esta seção.'}
						</p>
						<button
							onClick={reset}
							className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors'
							type='button'
						>
							<RefreshCw className='w-4 h-4' />
							Recarregar
						</button>
						{import.meta.env.DEV && (
							<details className='mt-4 text-left max-w-xs mx-auto'>
								<summary className='cursor-pointer text-xs text-gray-500 hover:text-gray-700'>
									Informações do erro
								</summary>
								<pre className='mt-2 p-2 bg-white border rounded text-xs overflow-auto'>
									{error.message}
								</pre>
							</details>
						)}
					</div>
				</div>
			)}
			onError={(error, errorInfo) => {
				// Log específico para dashboard
				console.error(`Dashboard Error [${section}]:`, error, errorInfo)
				
				// Aqui você pode implementar telemetria específica
				// por seção do dashboard
			}}
			resetKeys={[section]}
			resetOnPropsChange={true}
		>
			{children}
		</ErrorBoundary>
	)
}