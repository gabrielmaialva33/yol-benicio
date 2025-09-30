/**
 * ChatWidget Component
 * Floating chat widget with expand/collapse functionality
 */

import {useChatWidget} from '../hooks/use-chat-widget'
import {ChatFloatingButton} from './ChatFloatingButton'
import {ChatInput} from './ChatInput'
import {ChatWidgetHeader} from './ChatWidgetHeader'
import {ChatWindow} from './ChatWindow'

export function ChatWidget() {
	const {isOpen, setIsOpen, messages, isLoading, handleSend, handleClose} =
		useChatWidget()

	if (!isOpen) {
		return <ChatFloatingButton onClick={() => setIsOpen(true)} />
	}

	return (
		<div className='fixed bottom-6 right-6 flex flex-col bg-white rounded-lg shadow-2xl w-96 h-[600px] z-50 border border-gray-200'>
			<ChatWidgetHeader
				onClose={handleClose}
				onMinimize={() => setIsOpen(false)}
			/>

			<div className='flex-1 overflow-hidden'>
				<ChatWindow isLoading={isLoading} messages={messages} />
			</div>

			<div className='border-t border-gray-200 p-4'>
				<ChatInput disabled={isLoading} onSend={handleSend} />
			</div>
		</div>
	)
}
