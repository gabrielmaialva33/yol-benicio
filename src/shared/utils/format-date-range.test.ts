import type {DateRange} from 'react-day-picker'
import {describe, expect, it, vi} from 'vitest'
import {formatDateRange} from './format-date-range'

// Mock luxon
vi.mock('luxon', () => ({
	DateTime: {
		fromJSDate: (date: Date) => ({
			toFormat: (format: string) => {
				if (format === 'dd/MM/yyyy') {
					// Simple mock implementation
					const d = date.getDate().toString().padStart(2, '0')
					const m = (date.getMonth() + 1).toString().padStart(2, '0')
					const y = date.getFullYear()
					return `${d}/${m}/${y}`
				}
				return ''
			}
		})
	}
}))

describe('formatDateRange', () => {
	// Date constants
	const Year2024 = 2024
	const Year2023 = 2023
	const January = 0
	const February = 1
	const December = 11
	const Day5 = 5
	const Day10 = 10
	const Day15 = 15
	const Day25 = 25
	const Day31 = 31

	it('should return default message when dateRange is undefined', () => {
		const result = formatDateRange(undefined)
		expect(result).toBe('Selecione um período')
	})

	it('should return default message when dateRange.from is undefined', () => {
		const dateRange: DateRange = {
			from: undefined,
			to: undefined
		}
		const result = formatDateRange(dateRange)
		expect(result).toBe('Selecione um período')
	})

	it('should format single date when only from is provided', () => {
		const dateRange: DateRange = {
			from: new Date(Year2024, January, Day15), // January 15, 2024
			to: undefined
		}
		const result = formatDateRange(dateRange)
		expect(result).toBe('15/01/2024')
	})

	it('should format date range when both from and to are provided', () => {
		const dateRange: DateRange = {
			from: new Date(Year2024, January, Day15), // January 15, 2024
			to: new Date(Year2024, January, Day25) // January 25, 2024
		}
		const result = formatDateRange(dateRange)
		expect(result).toBe('15/01/2024 - 25/01/2024')
	})

	it('should handle same date for from and to', () => {
		const dateRange: DateRange = {
			from: new Date(Year2024, January, Day15),
			to: new Date(Year2024, January, Day15)
		}
		const result = formatDateRange(dateRange)
		expect(result).toBe('15/01/2024 - 15/01/2024')
	})

	it('should handle dates across different months', () => {
		const dateRange: DateRange = {
			from: new Date(Year2024, January, Day31), // January 31, 2024
			to: new Date(Year2024, February, Day10) // February 10, 2024
		}
		const result = formatDateRange(dateRange)
		expect(result).toBe('31/01/2024 - 10/02/2024')
	})

	it('should handle dates across different years', () => {
		const dateRange: DateRange = {
			from: new Date(Year2023, December, Day25), // December 25, 2023
			to: new Date(Year2024, January, Day5) // January 5, 2024
		}
		const result = formatDateRange(dateRange)
		expect(result).toBe('25/12/2023 - 05/01/2024')
	})
})
