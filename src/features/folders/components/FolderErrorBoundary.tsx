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
		<div className='flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm'>
			<div className='max-w-md w-full p-8 text-center'>
				<div className='inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4'>
					<Folder className='w-7 h-7 text-red-600' />
				</div>
				<h2 className='text-xl font-bold text-gray-900 mb-2'>
					{contextMessage}
				</h2>
				<p className='text-gray-600 mb-6'>{actionMessage}</p>

				<div className='flex flex-col sm:flex-row gap-3 justify-center'>
					<button
						className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
						onClick={reset}
						type='button'
					>
						{RETRY_BUTTON_LABEL}
					</button>
					{context === 'detail' && (
						<button
							className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
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
		<div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
			<div className='flex gap-2'>
				<AlertCircle className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
				<div className='text-left'>
					<p className='text-sm font-medium text-yellow-800'>
						{NOT_FOUND_TITLE}
					</p>
					<p className='text-sm text-yellow-700 mt-1'>
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
			<summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
				{ERROR_DETAILS_TITLE}
			</summary>
			<pre className='mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto'>
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
