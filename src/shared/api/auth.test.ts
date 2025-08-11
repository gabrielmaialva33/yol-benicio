import {vi} from 'vitest'
import {
	clearStoredToken,
	getMe,
	getStoredToken,
	login,
	logout,
	setStoredToken
} from './auth'

describe('auth api', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		clearStoredToken()
	})

	it('login salva token', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				token: 'abc',
				refresh_token: 'ref',
				id: 1,
				email: 'a@b.com'
			})
		} as unknown as Response)
		const res = await login({email: 'a@b.com', password: 'x'})
		expect(res.token).toBe('abc')
		expect(getStoredToken()).toBe('abc')
	})

	it('login erro', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: false,
			json: async () => ({errors: [{message: 'Credenciais inválidas'}]})
		} as unknown as Response)
		await expect(login({email: 'a@b.com', password: 'x'})).rejects.toThrow(
			'Credenciais inválidas'
		)
	})

	it('logout limpa token', async () => {
		setStoredToken('zzz')
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({})
		} as unknown as Response)
		await logout()
		expect(getStoredToken()).toBeNull()
	})

	it('getMe sem token falha', async () => {
		await expect(getMe()).rejects.toThrow('Unauthorized')
	})
})
