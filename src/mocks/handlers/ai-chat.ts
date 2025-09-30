/**
 * MSW Handlers for AI Chat
 * Mock API responses for development
 */

import {faker} from '@faker-js/faker'
import {HttpResponse, http} from 'msw'

interface ChatMessage {
	id: number
	conversation_id: number
	role: 'user' | 'assistant'
	content: string
	created_at: string
}

interface Conversation {
	id: number
	title: string
	user_id: number
	created_at: string
	updated_at: string
	messages?: ChatMessage[]
}

// In-memory storage for conversations
let conversations: Conversation[] = [
	{
		id: 1,
		title: 'Consulta sobre Recurso de Apelação',
		user_id: 1,
		created_at: new Date(Date.now() - 86_400_000).toISOString(), // 1 day ago
		updated_at: new Date().toISOString(),
		messages: [
			{
				id: 1,
				conversation_id: 1,
				role: 'user',
				content: 'O que é um recurso de apelação?',
				created_at: new Date(Date.now() - 86_400_000).toISOString()
			},
			{
				id: 2,
				conversation_id: 1,
				role: 'assistant',
				content:
					'O **recurso de apelação** é um instrumento processual previsto no Código de Processo Civil (CPC) que permite às partes requererem ao tribunal de segundo grau a reforma ou anulação de uma sentença proferida em primeira instância.\n\n## Características principais:\n\n- **Prazo**: 15 dias úteis a partir da intimação da sentença\n- **Efeito**: Pode ser recebido com efeito suspensivo ou apenas devolutivo\n- **Competência**: Tribunal de Justiça (casos estaduais) ou Tribunal Regional Federal (casos federais)\n\nÉ importante observar que nem todas as decisões são apeláveis. Cabe apelação apenas contra sentenças que encerram o processo com ou sem resolução de mérito.',
				created_at: new Date(Date.now() - 86_000_000).toISOString()
			}
		]
	}
]

let nextConversationId = 2
let nextMessageId = 3

export const aiChatHandlers = [
	// POST /api/v1/ai/chat/stream - Stream message with SSE
	http.post(
		'http://localhost:3333/api/v1/ai/chat/stream',
		async ({request}) => {
			const body = (await request.json()) as {
				message: string
				conversation_id?: number
			}

			let conversation: Conversation

			if (body.conversation_id) {
				// Find existing conversation
				const found = conversations.find(c => c.id === body.conversation_id)
				if (!found) {
					return new HttpResponse(null, {status: 404})
				}
				conversation = found
			} else {
				// Create new conversation
				conversation = {
					id: nextConversationId++,
					title: body.message.substring(0, 50),
					user_id: 1,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					messages: []
				}
				conversations.push(conversation)
			}

			// Add user message
			const userMessage: ChatMessage = {
				id: nextMessageId++,
				conversation_id: conversation.id,
				role: 'user',
				content: body.message,
				created_at: new Date().toISOString()
			}

			// Generate AI response
			const aiResponse = faker.lorem.paragraphs(2)
			const aiMessage: ChatMessage = {
				id: nextMessageId++,
				conversation_id: conversation.id,
				role: 'assistant',
				content: aiResponse,
				created_at: new Date().toISOString()
			}

			if (!conversation.messages) {
				conversation.messages = []
			}
			conversation.messages.push(userMessage, aiMessage)
			conversation.updated_at = new Date().toISOString()

			// Create SSE stream
			const encoder = new TextEncoder()
			const stream = new ReadableStream({
				start(controller) {
					// Send chunks of the response
					const words = aiResponse.split(' ')
					let currentChunk = ''

					for (let i = 0; i < words.length; i++) {
						currentChunk += (i > 0 ? ' ' : '') + words[i]

						// Send chunk every few words
						if ((i + 1) % 3 === 0 || i === words.length - 1) {
							const chunk = `data: ${JSON.stringify({content: currentChunk})}\n\n`
							controller.enqueue(encoder.encode(chunk))
							currentChunk = ''
						}
					}

					// Send conversation data
					const conversationChunk = `data: ${JSON.stringify({
						conversation: {
							id: conversation.id,
							title: conversation.title
						}
					})}\n\n`
					controller.enqueue(encoder.encode(conversationChunk))

					// Send done marker
					controller.enqueue(encoder.encode('data: [DONE]\n\n'))
					controller.close()
				}
			})

			return new HttpResponse(stream, {
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive'
				}
			})
		}
	),

	// POST /api/v1/ai/chat - Send message
	http.post('http://localhost:3333/api/v1/ai/chat', async ({request}) => {
		const body = (await request.json()) as {
			message: string
			conversation_id?: number
		}

		let conversation: Conversation

		if (body.conversation_id) {
			// Find existing conversation
			const found = conversations.find(c => c.id === body.conversation_id)
			if (!found) {
				return new HttpResponse(null, {status: 404})
			}
			conversation = found
		} else {
			// Create new conversation
			conversation = {
				id: nextConversationId++,
				title: body.message.substring(0, 50),
				user_id: 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				messages: []
			}
			conversations.push(conversation)
		}

		// Add user message
		const userMessage: ChatMessage = {
			id: nextMessageId++,
			conversation_id: conversation.id,
			role: 'user',
			content: body.message,
			created_at: new Date().toISOString()
		}

		// Generate AI response
		const aiMessage: ChatMessage = {
			id: nextMessageId++,
			conversation_id: conversation.id,
			role: 'assistant',
			content: faker.lorem.paragraphs(2),
			created_at: new Date().toISOString()
		}

		if (!conversation.messages) {
			conversation.messages = []
		}
		conversation.messages.push(userMessage, aiMessage)
		conversation.updated_at = new Date().toISOString()

		return HttpResponse.json({
			message: aiMessage,
			conversation
		})
	}),

	// GET /api/v1/ai/conversations - List conversations
	http.get('http://localhost:3333/api/v1/ai/conversations', () => {
		return HttpResponse.json({
			data: conversations.map(c => ({
				...c,
				messages: undefined // Don't include messages in list
			}))
		})
	}),

	// GET /api/v1/ai/conversations/:id - Get conversation
	http.get('http://localhost:3333/api/v1/ai/conversations/:id', ({params}) => {
		const id = Number(params.id)
		const conversation = conversations.find(c => c.id === id)

		if (!conversation) {
			return new HttpResponse(null, {status: 404})
		}

		return HttpResponse.json(conversation)
	}),

	// DELETE /api/v1/ai/conversations/:id - Delete conversation
	http.delete(
		'http://localhost:3333/api/v1/ai/conversations/:id',
		({params}) => {
			const id = Number(params.id)
			conversations = conversations.filter(c => c.id !== id)
			return new HttpResponse(null, {status: 204})
		}
	)
]
