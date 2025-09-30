import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import {initReactI18next} from 'react-i18next'
import enUS from './locales/en-US/translation.json' with {type: 'json'}
import ptBR from './locales/pt-BR/translation.json' with {type: 'json'}

// Constants
const DEFAULT_LANGUAGE = 'pt-BR'
const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US'] as const

// Type definitions
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Initialize i18n
const i18n = i18next
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			'pt-BR': {
				translation: ptBR
			},
			'en-US': {
				translation: enUS
			}
		},
		lng: DEFAULT_LANGUAGE,
		fallbackLng: DEFAULT_LANGUAGE,
		supportedLngs: SUPPORTED_LANGUAGES,
		debug: import.meta.env.DEV,
		interpolation: {
			escapeValue: false // React already escapes values
		},
		react: {
			useSuspense: true
		},
		detection: {
			order: ['localStorage', 'navigator', 'htmlTag'],
			caches: ['localStorage']
		}
	})

// Exports
export {DEFAULT_LANGUAGE, i18n, SUPPORTED_LANGUAGES}
export type {SupportedLanguage}
