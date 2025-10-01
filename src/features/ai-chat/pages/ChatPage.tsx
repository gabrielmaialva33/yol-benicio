/**
 * ChatPage Component
 * Main chat interface page
 */

import {ChatHeader} from '../components/ChatHeader'
import {ChatInput} from '../components/ChatInput'
import {ChatWindow} from '../components/ChatWindow'
import {ConversationList} from '../components/ConversationList'
import {useChatPage} from '../hooks/use-chat-page'

export function ChatPage() {
	const {
		conversations,
		messages,
		streamContent,
		isStreaming,
		isDeleting,
		currentConversationId,
		conversation,
		handleSendMessage,
		handleNewConversation,
		handleDeleteConversation,
		handleDeleteCurrentConversation
	} = useChatPage()

	return (
		<div className='flex h-full'>
			<ConversationList
				activeConversationId={currentConversationId}
				conversations={conversations}
				isDeleting={isDeleting}
				onDeleteConversation={handleDeleteConversation}
				onNewConversation={handleNewConversation}
			/>

			<div className='flex flex-1 flex-col'>
				<ChatHeader
					conversationId={currentConversationId}
					onDeleteConversation={handleDeleteCurrentConversation}
					title={conversation?.title}
				/>

				<div className='flex-1 overflow-hidden bg-gray-50'>
					<ChatWindow
						isStreaming={isStreaming}
						messages={messages}
						streamingContent={streamContent}
					/>
				</div>

				<ChatInput disabled={isStreaming} onSend={handleSendMessage} />
			</div>
		</div>
	)
}
