/**
 * Cache time constants for React Query and other caching mechanisms
 */

// Time units in milliseconds
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

// Time multipliers
const TEN_SECONDS = 10
const THIRTY_SECONDS = 30
const FIVE_MINUTES = 5
const TEN_MINUTES = 10
const FIFTEEN_MINUTES = 15
const THIRTY_MINUTES = 30

// Cache times for React Query
export const CACHE_TIMES = {
	// Time units
	ONE_SECOND: Number(SECOND),
	ONE_MINUTE: Number(MINUTE),
	FIVE_MINUTES: FIVE_MINUTES * MINUTE,
	// Stale times - how long data is considered fresh
	STALE: {
		IMMEDIATE: 0,
		VERY_SHORT: TEN_SECONDS * SECOND,
		SHORT: THIRTY_SECONDS * SECOND,
		DEFAULT: Number(MINUTE),
		MEDIUM: FIVE_MINUTES * MINUTE,
		LONG: TEN_MINUTES * MINUTE,
		VERY_LONG: THIRTY_MINUTES * MINUTE,
		HOUR: Number(HOUR)
	},
	// Garbage collection times - how long to keep unused data in cache
	GC: {
		SHORT: FIVE_MINUTES * MINUTE,
		DEFAULT: TEN_MINUTES * MINUTE,
		MEDIUM: FIFTEEN_MINUTES * MINUTE,
		LONG: THIRTY_MINUTES * MINUTE,
		VERY_LONG: Number(HOUR)
	},
	// Retry delays
	RETRY: {
		INITIAL: Number(SECOND),
		MULTIPLIER: 2,
		MAX_ATTEMPTS: 3
	}
} as const

// Debounce and throttle times
export const TIMING = {
	DEBOUNCE: {
		SEARCH: 300,
		INPUT: 500,
		RESIZE: 200
	},
	THROTTLE: {
		SCROLL: 100,
		RESIZE: 200
	},
	DELAY: {
		TOOLTIP: 500,
		NOTIFICATION: 3000,
		REDIRECT: 1000
	}
} as const
