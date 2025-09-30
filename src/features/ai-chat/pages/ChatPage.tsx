/**
 * ChatPage Component
 * Main chat interface page
 */

import {useCallback, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router'
import {ChatHeader} from '../components/ChatHeader'
import {ChatInput} from '../components/ChatInput'
import {ChatWindow} from '../components/ChatWindow'
import {ConversationList} from '../components/ConversationList'
import {useConversation} from '../hooks/use-conversation'
import {useConversations} from '../hooks/use-conversations'
import {useDeleteConversation} from '../hooks/use-delete-conversation'
import {useStreamingChat} from '../hooks/use-streaming-chat'

export function ChatPage() {
	const {conversationId} = useParams<{conversationId?: string}>()
	const navigate = useNavigate()

	// Fetch conversations list
	const {data: conversations = []} = useConversations()

	// Fetch current conversation
	const currentConversationId = conversationId
		? Number.parseInt(conversationId, 10)
		: undefined
	const {
		data: currentConversation,
		isLoading: isLoadingConversation,
		refetch: refetchConversation
	} = useConversation(currentConversationId)

	// Streaming chat hook
	const {
		sendStreamingMessage,
		isStreaming,
		streamingContent,
		reset: resetStreaming
	} = useStreamingChat()

	// Delete conversation hook
	const {deleteConversation, isDeleting} = useDeleteConversation()

	// Handle send message
	const handleSendMessage = useCallback(
		async (message: string) => {
			resetStreaming()

			const request: any = {message, mode: 'single'}
			if (currentConversationId) {
				request.conversation_id = currentConversationId
			}
			await sendStreamingMessage(request)

			// Refetch conversation to get updated messages
			setTimeout(() => {
				refetchConversation()
			}, 1000)
		},
		[
			currentConversationId,
			sendStreamingMessage,
			resetStreaming,
			refetchConversation
		]
	)

	// Handle new conversation
	const handleNewConversation = useCallback(() => {
		navigate('/dashboard/chat')
		resetStreaming()
	}, [navigate, resetStreaming])

	// Handle delete conversation
	const handleDeleteConversation = useCallback(
		(id: number) => {
			deleteConversation(id, {
				onSuccess: () => {
					// Navigate to base chat if deleting current conversation
					if (id === currentConversationId) {
						navigate('/dashboard/chat')
					}
				}
			})
		},
		[deleteConversation, currentConversationId, navigate]
	)

	// Handle delete current conversation
	const handleDeleteCurrentConversation = useCallback(() => {
		if (currentConversationId) {
			handleDeleteConversation(currentConversationId)
		}
	}, [currentConversationId, handleDeleteConversation])

	// Reset streaming when conversation changes
	useEffect(() => {
		resetStreaming()
	}, [resetStreaming])

	return (
		<div className='flex h-[calc(100vh-64px)]'>
			{/* Sidebar with conversations */}
			<ConversationList
				activeConversationId={currentConversationId}
				conversations={conversations}
				isDeleting={isDeleting}
				onDeleteConversation={handleDeleteConversation}
				onNewConversation={handleNewConversation}
			/>

			{/* Main chat area */}
			<div className='flex flex-1 flex-col'>
				<ChatHeader
					conversationId={currentConversationId}
					onDeleteConversation={
						currentConversationId ? handleDeleteCurrentConversation : undefined
					}
					title={currentConversation?.title || 'Chat IA'}
				/>

				<ChatWindow
					isLoading={isLoadingConversation && Boolean(currentConversationId)}
					isStreaming={isStreaming}
					messages={currentConversation?.messages || []}
					streamingContent={streamingContent}
				/>

				<ChatInput
					disabled={isStreaming}
					onSend={handleSendMessage}
					placeholder={
						isStreaming ? 'Aguarde a resposta...' : 'Digite sua mensagem...'
					}
				/>
			</div>
		</div>
	)
}
