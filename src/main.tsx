import './global.css'
import './core/i18n'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import {App} from './App'
import {ENABLE_MSW} from './config/api'
import {worker} from './mocks/browser'
import {AuthProvider} from './shared/hooks/use-auth'
import {LoadingScreen} from './shared/components/LoadingScreen'

const queryClient = new QueryClient()

// Start MSW only if enabled
if (
	ENABLE_MSW &&
	(import.meta.env.DEV || window.location.hostname.includes('github.io'))
) {
	worker.start({
		serviceWorker: {
			url: '/yol-benicio/mock-service-worker.js'
		}
	})
}

const container = document.querySelector('#root')
if (container) {
	const root = createRoot(container)
	root.render(
		<StrictMode>
			<Suspense fallback={<LoadingScreen />}>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<ReactQueryDevtools initialIsOpen={false} />
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</AuthProvider>
				</QueryClientProvider>
			</Suspense>
		</StrictMode>
	)
}
