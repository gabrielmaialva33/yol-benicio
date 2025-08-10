// Configuração da API

// Definir se deve usar mocks ou API real
export const USE_MOCK_API = false // Mudar para false para usar o backend real

// URL base da API
export const API_BASE_URL = USE_MOCK_API ? '' : '/api'

// Configuração para desabilitar MSW quando usando API real
export const ENABLE_MSW = USE_MOCK_API
