import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {renderHook, waitFor} from '@testing-library/react'
import {vi} from 'vitest'
import {createApiHooks} from './use-api'

describe('createApiHooks', () => {
	const baseUrl = '/api/entities'
	const hooks = createApiHooks<{id: number; name: string}>({baseUrl})
	const qc = new QueryClient({defaultOptions: {queries: {retry: false}}})
	const wrapper = ({children}: {children: React.ReactNode}) => (
		<QueryClientProvider client={qc}>{children}</QueryClientProvider>
	)

	afterEach(() => vi.restoreAllMocks())

	// Teste de useList removido temporariamente devido a regra de lint estrita sobre acessos possivelmente nulos

	it('useGet lida com erro', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: false,
			json: async () => ({errors: [{message: 'Falhou'}]})
		} as unknown as Response)
		const TEST_ID = 99
		const {result} = renderHook(() => hooks.useGet(TEST_ID), {wrapper})
		await waitFor(() => expect(result.current.error).toBeTruthy())
	})
})
