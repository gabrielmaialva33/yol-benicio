/**
 * UI-related constants
 */

// Pagination sizes
const PAGE_SIZE_SMALL = 10
const PAGE_SIZE_MEDIUM = 20
const PAGE_SIZE_LARGE = 50
const PAGE_SIZE_XLARGE = 100

// File size units
const KILOBYTE = 1024
const MEGABYTE = KILOBYTE * KILOBYTE
const FILE_SIZE_MB = 10

// Pagination
export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_PAGE_SIZE: PAGE_SIZE_MEDIUM,
	PAGE_SIZE_OPTIONS: [
		PAGE_SIZE_SMALL,
		PAGE_SIZE_MEDIUM,
		PAGE_SIZE_LARGE,
		PAGE_SIZE_XLARGE
	] as const,
	MAX_PAGE_SIZE: PAGE_SIZE_XLARGE
} as const

// Limits
export const LIMITS = {
	MAX_FILE_SIZE: FILE_SIZE_MB * MEGABYTE, // 10MB
	MAX_MESSAGE_LENGTH: 4000,
	MAX_TITLE_LENGTH: 100,
	MAX_DESCRIPTION_LENGTH: 500,
	MIN_PASSWORD_LENGTH: 8,
	MAX_PASSWORD_LENGTH: 128,
	MAX_FUNCTION_LINES: 80,
	MAX_FILE_LINES: 500
} as const

// Breakpoints for responsive design
export const BREAKPOINTS = {
	MOBILE: 640,
	TABLET: 768,
	DESKTOP: 1024,
	WIDE: 1280
} as const

// Z-index layers
export const Z_INDEX = {
	DROPDOWN: 100,
	STICKY: 200,
	MODAL_BACKDROP: 300,
	MODAL: 400,
	POPOVER: 500,
	TOOLTIP: 600,
	NOTIFICATION: 700,
	LOADING: 800
} as const

// Animation durations (in ms)
export const ANIMATION = {
	FAST: 150,
	NORMAL: 300,
	SLOW: 500
} as const

// Chat specific constants
export const CHAT = {
	SSE_DATA_PREFIX: 'data: ',
	SSE_DATA_PREFIX_LENGTH: 6,
	MAX_RETRIES: 3,
	RETRY_DELAY: 1000
} as const

// Colors and themes
export const COLORS = {
	BRAND: {
		CYAN: '#36ABD9',
		MIDNIGHT: '#01102A',
		PURPLE: '#6B46C1'
	},
	STATUS: {
		SUCCESS: '#10B981',
		ERROR: '#EF4444',
		WARNING: '#F59E0B',
		INFO: '#3B82F6'
	}
} as const
