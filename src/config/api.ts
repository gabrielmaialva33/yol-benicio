// API configuration

// API base URL from environment variable with fallback
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333'

// MSW configuration - controlled by environment variable
export const ENABLE_MSW = import.meta.env.VITE_ENABLE_MSW === 'true'
