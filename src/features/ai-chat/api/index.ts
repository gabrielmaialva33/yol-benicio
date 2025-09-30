/**
 * AI Chat API Functions
 * Handles all communication with backend AI endpoints
 */

import {API_BASE_URL} from '@app/../config/api'
import {getStoredToken} from '@shared/api/auth'
import type {
	Conversation,
	ConversationsListResponse,
	SendMessageRequest,
	SendMessageResponse,
	StreamChunk
} from '../types'

/**
 * Get auth headers for API requests
 */
function getAuthHeaders(): HeadersInit {
	const token = getStoredToken()
	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json'
	}
}

/**
 * Send chat message (non-streaming)
 */
export async function sendMessage(
	request: SendMessageRequest
): Promise<SendMessageResponse> {
	const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(request)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.errors?.[0]?.message || 'Failed to send message')
	}

	return response.json()
}

const SSE_DATA_PREFIX_LENGTH = 6 // Length of 'data: ' prefix
const SSE_DONE_MARKER = '[DONE]'

/**
 * Process a single SSE line
 */
function processSSELine(
	line: string,
	onChunk: (chunk: StreamChunk) => void
): boolean {
	if (!line.startsWith('data: ')) {
		return false
	}

	const data = line.slice(SSE_DATA_PREFIX_LENGTH)

	if (data === SSE_DONE_MARKER) {
		onChunk({content: '', done: true})
		return true
	}

	try {
		const chunk = JSON.parse(data)
		if (chunk.content !== undefined) {
			onChunk({
				content: chunk.content,
				done: false,
				conversation: chunk.conversation
			})
		}
	} catch {
		// Ignore malformed JSON
	}

	return false
}

/**
 * Send chat message with Server-Sent Events streaming
 */
export async function streamMessage(
	request: SendMessageRequest,
	onChunk: (chunk: StreamChunk) => void
): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat/stream`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(request)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.errors?.[0]?.message || 'Failed to stream message')
	}

	const reader = response.body?.getReader()
	const decoder = new TextDecoder()

	if (!reader) {
		throw new Error('Response body is not readable')
	}

	let buffer = ''
	let shouldStop = false

	try {
		// biome-ignore lint/correctness/noConstantCondition: Need infinite loop for streaming
		while (!shouldStop) {
			// biome-ignore lint/performance/noAwaitInLoops: Sequential reading required for streaming
			const {done, value} = await reader.read()

			if (done) {
				onChunk({content: '', done: true})
				break
			}

			// Decode chunk
			buffer += decoder.decode(value, {stream: true})

			// Process SSE events
			const lines = buffer.split('\n')
			buffer = lines.pop() || ''

			for (const line of lines) {
				const isDone = processSSELine(line, onChunk)
				if (isDone) {
					shouldStop = true
					break
				}
			}
		}
	} finally {
		reader.releaseLock()
	}
}

/**
 * Get all conversations
 */
export async function getConversations(): Promise<Conversation[]> {
	const response = await fetch(`${API_BASE_URL}/api/v1/ai/conversations`, {
		headers: getAuthHeaders()
	})

	if (!response.ok) {
		throw new Error('Failed to fetch conversations')
	}

	const data: ConversationsListResponse = await response.json()
	return data.data
}

/**
 * Get specific conversation with messages
 */
export async function getConversation(id: number): Promise<Conversation> {
	const response = await fetch(
		`${API_BASE_URL}/api/v1/ai/conversations/${id}`,
		{
			headers: getAuthHeaders()
		}
	)

	if (!response.ok) {
		throw new Error('Failed to fetch conversation')
	}

	return response.json()
}

/**
 * Delete conversation
 */
export async function deleteConversation(id: number): Promise<void> {
	const response = await fetch(
		`${API_BASE_URL}/api/v1/ai/conversations/${id}`,
		{
			method: 'DELETE',
			headers: getAuthHeaders()
		}
	)

	if (!response.ok) {
		throw new Error('Failed to delete conversation')
	}
}
