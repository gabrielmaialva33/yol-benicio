/**
 * AI Chat Types
 * TypeScript interfaces for AI chat feature
 */

export interface ChatMessage {
	id: number
	conversation_id: number
	role: 'user' | 'assistant'
	content: string
	created_at: string
}

// Alias for backward compatibility
export type Message = ChatMessage

export interface Conversation {
	id: number
	title: string
	user_id: number
	created_at: string
	updated_at: string
	messages?: ChatMessage[]
	lastMessage?: ChatMessage
}

export interface SendMessageRequest {
	message: string
	conversation_id?: number
	mode?: 'single' | 'multi'
}

export interface SendMessageResponse {
	message: ChatMessage
	conversation: Conversation
}

export interface ConversationsListResponse {
	data: Conversation[]
	meta?: {
		total: number
		per_page: number
		current_page: number
		last_page: number
	}
}

export interface StreamChunk {
	content: string
	done: boolean
	conversation?: {
		id: number
		title: string
	}
}
