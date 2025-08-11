import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {type RenderOptions, render as rtlRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {PropsWithChildren, ReactElement} from 'react'
import {BrowserRouter} from 'react-router'
import {AuthProvider} from './shared/hooks/use-auth'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {gcTime: Number.POSITIVE_INFINITY, retry: false}
	}
})

export function render(
	ui: ReactElement,
	{route, ...options}: Omit<RenderOptions, 'wrapper'> & {route?: string} = {
		reactStrictMode: true
	}
) {
	window.history.pushState({}, 'Test page', route)

	return {
		user: userEvent.setup(),
		...rtlRender(ui, {
			wrapper: ({children}: PropsWithChildren) => (
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<AuthProvider>{children}</AuthProvider>
					</BrowserRouter>
				</QueryClientProvider>
			),
			...options
		})
	}
}

// biome-ignore lint: test file
export * from '@testing-library/react'
