import {ErrorBoundary} from '@shared/components/ErrorBoundary'
import {LogIn} from 'lucide-react'
import type {ReactNode} from 'react'

interface AuthErrorBoundaryProps {
	children: ReactNode
}

const AUTH_ERROR_TITLE = 'Erro na Autenticação'
const AUTH_ERROR_MESSAGE =
	'Ocorreu um problema ao processar sua autenticação. Por favor, tente novamente.'
const TECHNICAL_DETAILS_LABEL = 'Detalhes técnicos'
const TRY_AGAIN_BUTTON = 'Tentar novamente'
const RELOAD_PAGE_BUTTON = 'Recarregar página'

/**
 * Error Boundary específico para a feature de autenticação
 */
export function AuthErrorBoundary({children}: AuthErrorBoundaryProps) {
	return (
		<ErrorBoundary
			fallback={(error, reset) => (
				<div className='flex min-h-screen items-center justify-center bg-[#373737]'>
					<div className='w-full max-w-md rounded-lg bg-white p-8 shadow-xl'>
						<div className='flex flex-col items-center gap-4'>
							<div className='rounded-full bg-red-100 p-3'>
								<LogIn className='h-8 w-8 text-red-600' />
							</div>
							<h2 className='font-bold text-gray-900 text-xl'>
								{AUTH_ERROR_TITLE}
							</h2>
							<p className='text-center text-gray-600'>{AUTH_ERROR_MESSAGE}</p>
							{import.meta.env.DEV && (
								<details className='mt-4 w-full'>
									<summary className='cursor-pointer text-gray-500 text-sm hover:text-gray-700'>
										{TECHNICAL_DETAILS_LABEL}
									</summary>
									<pre className='mt-2 overflow-auto rounded bg-gray-50 p-2 text-xs'>
										{error.message}
									</pre>
								</details>
							)}
							<button
								className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
								onClick={reset}
								type='button'
							>
								{TRY_AGAIN_BUTTON}
							</button>
							<button
								className='text-gray-600 text-sm hover:text-gray-800'
								onClick={() => window.location.reload()}
								type='button'
							>
								{RELOAD_PAGE_BUTTON}
							</button>
						</div>
					</div>
				</div>
			)}
			level='page'
			onError={(_error, _errorInfo) => {
				// Intentionally empty - errors are handled by parent component
			}}
		>
			{children}
		</ErrorBoundary>
	)
}
