import {ErrorBoundary, type FallbackProps} from 'react-error-boundary'
import {AppRouter} from './app/router'

const ERROR_PREFIX = 'Error: '

function renderError({error}: FallbackProps) {
	return <div>{ERROR_PREFIX}{error.message}</div>
}

export function App() {
	return (
		<ErrorBoundary fallbackRender={renderError}>
			<AppRouter />
		</ErrorBoundary>
	)
}
