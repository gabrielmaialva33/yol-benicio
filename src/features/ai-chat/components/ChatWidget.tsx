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
		<div className='fixed right-6 bottom-6 z-50 flex h-[600px] w-96 flex-col rounded-lg border border-gray-200 bg-white shadow-2xl'>
			<ChatWidgetHeader
				onClose={handleClose}
				onMinimize={() => setIsOpen(false)}
			/>

			<div className='flex-1 overflow-hidden'>
				<ChatWindow isLoading={isLoading} messages={messages} />
			</div>

			<div className='border-gray-200 border-t p-4'>
				<ChatInput disabled={isLoading} onSend={handleSend} />
			</div>
		</div>
	)
}
