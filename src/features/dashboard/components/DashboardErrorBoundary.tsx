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
					className={`flex items-center justify-center ${getHeightClass(section)} rounded-lg bg-gray-50`}
				>
					<div className='p-6 text-center'>
						<div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100'>
							<LayoutDashboard className='h-6 w-6 text-orange-600' />
						</div>
						<h3 className='mb-2 font-semibold text-gray-900 text-lg'>
							{getSectionMessage()}
						</h3>
						<p className='mb-4 text-gray-600 text-sm'>
							{section === 'widget'
								? WIDGET_AUTO_RELOAD_MESSAGE
								: MANUAL_RELOAD_MESSAGE}
						</p>
						<button
							className='inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600'
							onClick={reset}
							type='button'
						>
							<RefreshCw className='h-4 w-4' />
							{RELOAD_BUTTON_TEXT}
						</button>
						{import.meta.env.DEV && (
							<details className='mx-auto mt-4 max-w-xs text-left'>
								<summary className='cursor-pointer text-gray-500 text-xs hover:text-gray-700'>
									{ERROR_INFO_TITLE}
								</summary>
								<pre className='mt-2 overflow-auto rounded border bg-white p-2 text-xs'>
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
