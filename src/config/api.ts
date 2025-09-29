// API configuration

export const USE_MOCK_API = false // Disable MSW to use real API

// API base URL
export const API_BASE_URL = 'http://localhost:3333'

// MSW configuration - disabled when using real API
export const ENABLE_MSW = USE_MOCK_API
