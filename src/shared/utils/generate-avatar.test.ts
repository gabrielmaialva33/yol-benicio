import {describe, expect, it} from 'vitest'
import {generateAvatar} from './generate-avatar'

describe('generateAvatar', () => {
	const AvatarGenerationCount = 50

	it('should generate avatar URL with all required parameters', () => {
		const avatarUrl = generateAvatar()

		expect(avatarUrl).toContain('https://avataaars.io/')
		expect(avatarUrl).toContain('avatarStyle=Circle')
		expect(avatarUrl).toContain('topType=')
		expect(avatarUrl).toContain('accessoriesType=')
		expect(avatarUrl).toContain('hairColor=')
		expect(avatarUrl).toContain('facialHairType=')
		expect(avatarUrl).toContain('clotheType=')
		expect(avatarUrl).toContain('eyeType=')
		expect(avatarUrl).toContain('eyebrowType=')
		expect(avatarUrl).toContain('mouthType=')
		expect(avatarUrl).toContain('skinColor=')
	})

	it('should return a valid URL', () => {
		const avatarUrl = generateAvatar()

		// Check if it's a valid URL
		expect(() => new URL(avatarUrl)).not.toThrow()
	})

	it('should always use Circle avatar style', () => {
		const avatarUrl = generateAvatar()

		expect(avatarUrl).toContain('avatarStyle=Circle')
	})

	it('should generate different avatars on multiple calls', () => {
		const avatars = new Set()

		// Generate 50 avatars to increase chance of getting different ones
		for (let i = 0; i < AvatarGenerationCount; i++) {
			avatars.add(generateAvatar())
		}

		// With randomization, we should get at least some different avatars
		expect(avatars.size).toBeGreaterThan(1)
	})

	it('should include valid avatar components', () => {
		const avatarUrl = generateAvatar()
		const url = new URL(avatarUrl)

		// Check that all required parameters exist
		expect(url.searchParams.has('avatarStyle')).toBe(true)
		expect(url.searchParams.has('topType')).toBe(true)
		expect(url.searchParams.has('accessoriesType')).toBe(true)
		expect(url.searchParams.has('hairColor')).toBe(true)
		expect(url.searchParams.has('facialHairType')).toBe(true)
		expect(url.searchParams.has('clotheType')).toBe(true)
		expect(url.searchParams.has('eyeType')).toBe(true)
		expect(url.searchParams.has('eyebrowType')).toBe(true)
		expect(url.searchParams.has('mouthType')).toBe(true)
		expect(url.searchParams.has('skinColor')).toBe(true)
	})
})
