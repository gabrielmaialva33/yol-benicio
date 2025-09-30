import {ErrorBoundary} from '@shared/components/ErrorBoundary'
import {AlertCircle, Folder} from 'lucide-react'
import type {ReactNode} from 'react'
import {useNavigate} from 'react-router'

const RETRY_BUTTON_LABEL = 'Tentar novamente'
const BACK_TO_LIST_BUTTON_LABEL = 'Voltar para lista'
const NOT_FOUND_TITLE = 'Pasta não encontrada'
const NOT_FOUND_DESCRIPTION = 'Esta pasta pode ter sido arquivada ou excluída.'
const ERROR_DETAILS_TITLE = 'Detalhes do erro'

interface FolderErrorBoundaryProps {
	children: ReactNode
	folderId?: string
	context?: 'list' | 'detail' | 'form'
}

interface ErrorFallbackProps {
	error: Error
	reset: () => void
	contextMessage: string
	actionMessage: string
	context: 'list' | 'detail' | 'form'
	onNavigate: () => void
}

function _ErrorFallback({
	error,
	reset,
	contextMessage,
	actionMessage,
	context,
	onNavigate
}: ErrorFallbackProps) {
	return (
		<div className='flex min-h-[400px] items-center justify-center rounded-lg bg-white shadow-sm'>
			<div className='w-full max-w-md p-8 text-center'>
				<div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100'>
					<Folder className='h-7 w-7 text-red-600' />
				</div>
				<h2 className='mb-2 font-bold text-gray-900 text-xl'>
					{contextMessage}
				</h2>
				<p className='mb-6 text-gray-600'>{actionMessage}</p>

				<div className='flex flex-col justify-center gap-3 sm:flex-row'>
					<button
						className='rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
						onClick={reset}
						type='button'
					>
						{RETRY_BUTTON_LABEL}
					</button>
					{context === 'detail' && (
						<button
							className='rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300'
							onClick={onNavigate}
							type='button'
						>
							{BACK_TO_LIST_BUTTON_LABEL}
						</button>
					)}
				</div>

				{error.message.includes('404') && <_NotFoundWarning />}

				{import.meta.env.DEV && <_ErrorDetails error={error} />}
			</div>
		</div>
	)
}

function _NotFoundWarning() {
	return (
		<div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
			<div className='flex gap-2'>
				<AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600' />
				<div className='text-left'>
					<p className='font-medium text-sm text-yellow-800'>
						{NOT_FOUND_TITLE}
					</p>
					<p className='mt-1 text-sm text-yellow-700'>
						{NOT_FOUND_DESCRIPTION}
					</p>
				</div>
			</div>
		</div>
	)
}

function _ErrorDetails({error}: {error: Error}) {
	return (
		<details className='mt-6 text-left'>
			<summary className='cursor-pointer text-gray-500 text-sm hover:text-gray-700'>
				{ERROR_DETAILS_TITLE}
			</summary>
			<pre className='mt-2 overflow-auto rounded bg-gray-50 p-3 text-xs'>
				{error.stack || error.message}
			</pre>
		</details>
	)
}

/**
 * Error Boundary específico para a feature de pastas
 */
export function FolderErrorBoundary({
	children,
	folderId,
	context = 'list'
}: FolderErrorBoundaryProps) {
	const navigate = useNavigate()

	const getContextLevel = () => {
		switch (context) {
			case 'form':
				return 'component' as const
			case 'detail':
				return 'section' as const
			default:
				return 'page' as const
		}
	}

	const getContextMessage = () => {
		switch (context) {
			case 'form':
				return 'Erro ao processar o formulário'
			case 'detail':
				return `Não foi possível carregar os detalhes ${
					folderId ? `da pasta ${folderId}` : 'desta pasta'
				}`
			default:
				return 'Erro ao carregar as pastas'
		}
	}

	const getActionMessage = () => {
		switch (context) {
			case 'form':
				return 'Verifique os dados e tente novamente'
			case 'detail':
				return 'A pasta pode ter sido movida ou excluída'
			default:
				return 'Não foi possível carregar a lista de pastas'
		}
	}

	return (
		<ErrorBoundary
			fallback={(error, reset) => (
				<_ErrorFallback
					actionMessage={getActionMessage()}
					context={context}
					contextMessage={getContextMessage()}
					error={error}
					onNavigate={() => navigate('/dashboard/folders/consultation')}
					reset={reset}
				/>
			)}
			level={getContextLevel()}
			onError={(_error, _errorInfo) => {
				// Error logging handled by parent ErrorBoundary component
			}}
			resetKeys={[folderId || '', context]}
			resetOnPropsChange={true}
		>
			{children}
		</ErrorBoundary>
	)
}
