// API configuration

export const USE_MOCK_API = true // Enable MSW for mock data

// API base URL
export const API_BASE_URL = USE_MOCK_API ? '' : '/api'

// MSW configuration - disabled when using real API
export const ENABLE_MSW = USE_MOCK_API
