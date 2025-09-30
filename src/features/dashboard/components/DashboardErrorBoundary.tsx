import {ErrorBoundary} from '@shared/components/ErrorBoundary'
import {LayoutDashboard, RefreshCw} from 'lucide-react'
import type {ReactNode} from 'react'

interface DashboardErrorBoundaryProps {
	children: ReactNode
	section?: 'widget' | 'sidebar' | 'header' | 'main'
}

const ERROR_MESSAGES = {
	widget: 'Este widget não pôde ser carregado',
	sidebar: 'O menu lateral encontrou um problema',
	header: 'O cabeçalho não pôde ser carregado',
	main: 'O dashboard encontrou um problema'
}

const WIDGET_AUTO_RELOAD_MESSAGE =
	'Os dados serão recarregados automaticamente em alguns segundos.'
const MANUAL_RELOAD_MESSAGE = 'Por favor, tente recarregar esta seção.'
const RELOAD_BUTTON_TEXT = 'Recarregar'
const ERROR_INFO_TITLE = 'Informações do erro'

function getHeightClass(section: string): string {
	if (section === 'widget') {
		return 'h-full min-h-[200px]'
	}
	if (section === 'main') {
		return 'min-h-screen'
	}
	return 'min-h-[300px]'
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

	const getSectionMessage = () => ERROR_MESSAGES[section] || ERROR_MESSAGES.main

	return (
		<ErrorBoundary
			fallback={(error, reset) => (
				<div
					className={`flex items-center justify-center ${getHeightClass(section)} bg-gray-50 rounded-lg`}
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
								? WIDGET_AUTO_RELOAD_MESSAGE
								: MANUAL_RELOAD_MESSAGE}
						</p>
						<button
							className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors'
							onClick={reset}
							type='button'
						>
							<RefreshCw className='w-4 h-4' />
							{RELOAD_BUTTON_TEXT}
						</button>
						{import.meta.env.DEV && (
							<details className='mt-4 text-left max-w-xs mx-auto'>
								<summary className='cursor-pointer text-xs text-gray-500 hover:text-gray-700'>
									{ERROR_INFO_TITLE}
								</summary>
								<pre className='mt-2 p-2 bg-white border rounded text-xs overflow-auto'>
									{error.message}
								</pre>
							</details>
						)}
					</div>
				</div>
			)}
			isolate={section === 'widget'}
			level={getSectionLevel()}
			onError={(_error, _errorInfo) => {
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
