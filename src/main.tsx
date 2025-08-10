import './global.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import {App} from './App'
import {ENABLE_MSW} from './config/api'
import {worker} from './mocks/browser'

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
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<BrowserRouter basename='/yol-benicio/'>
					<App />
				</BrowserRouter>
			</QueryClientProvider>
		</StrictMode>
	)
}
