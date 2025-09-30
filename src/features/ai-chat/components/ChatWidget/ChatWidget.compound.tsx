/**
 * ChatWidget Compound Component
 * A flexible, composable chat widget using compound component pattern
 */

import {createCompoundComponentContext} from '@shared/components/patterns/CompoundComponent'
import {cn} from '@ui/utils/cn'
import {MessageSquare, Minimize2, X} from 'lucide-react'
import React, {useReducer} from 'react'
import {useTranslation} from '@/core/i18n'
import type {Conversation, Message} from '../../types'

// Context Types
interface ChatWidgetContextType {
	isOpen: boolean
	isMinimized: boolean
	activeConversation: Conversation | null
	conversations: Conversation[]
	messages: Message[]
	actions: {
		toggle: () => void
		minimize: () => void
		close: () => void
		selectConversation: (conversation: Conversation) => void
		sendMessage: (content: string) => void
	}
}

// State Types
interface ChatWidgetState {
	isOpen: boolean
	isMinimized: boolean
	activeConversation: Conversation | null
	conversations: Conversation[]
	messages: Message[]
}

// Action Types
type ChatWidgetAction =
	| {type: 'TOGGLE'}
	| {type: 'MINIMIZE'}
	| {type: 'CLOSE'}
	| {type: 'SELECT_CONVERSATION'; payload: Conversation}
	| {type: 'SEND_MESSAGE'; payload: string}
	| {type: 'SET_CONVERSATIONS'; payload: Conversation[]}
	| {type: 'SET_MESSAGES'; payload: Message[]}

// Create context
const [ChatWidgetProvider, useChatWidget] =
	createCompoundComponentContext<ChatWidgetContextType>('ChatWidget')

// Reducer
function chatWidgetReducer(
	state: ChatWidgetState,
	action: ChatWidgetAction
): ChatWidgetState {
	switch (action.type) {
		case 'TOGGLE':
			return {...state, isOpen: !state.isOpen, isMinimized: false}
		case 'MINIMIZE':
			return {...state, isMinimized: !state.isMinimized}
		case 'CLOSE':
			return {...state, isOpen: false, isMinimized: false}
		case 'SELECT_CONVERSATION':
			return {
				...state,
				activeConversation: action.payload,
				messages: action.payload.messages || []
			}
		case 'SET_CONVERSATIONS':
			return {...state, conversations: action.payload}
		case 'SET_MESSAGES':
			return {...state, messages: action.payload}
		case 'SEND_MESSAGE':
			// This would typically trigger an API call
			return state
		default:
			return state
	}
}

// Main compound component
interface ChatWidgetProps {
	children: React.ReactNode
	defaultOpen?: boolean
	conversations?: Conversation[]
}

function ChatWidget({
	children,
	defaultOpen = false,
	conversations = []
}: ChatWidgetProps) {
	const [state, dispatch] = useReducer(chatWidgetReducer, {
		isOpen: defaultOpen,
		isMinimized: false,
		activeConversation: null,
		conversations,
		messages: []
	})

	const actions = {
		toggle: () => dispatch({type: 'TOGGLE'}),
		minimize: () => dispatch({type: 'MINIMIZE'}),
		close: () => dispatch({type: 'CLOSE'}),
		selectConversation: (conversation: Conversation) =>
			dispatch({type: 'SELECT_CONVERSATION', payload: conversation}),
		sendMessage: (content: string) =>
			dispatch({type: 'SEND_MESSAGE', payload: content})
	}

	return (
		<ChatWidgetProvider value={{...state, actions}}>
			<div className='fixed bottom-4 right-4 z-50'>{children}</div>
		</ChatWidgetProvider>
	)
}

// Sub-component: Trigger Button
ChatWidget.Trigger = function ChatWidgetTrigger() {
	const {isOpen, actions} = useChatWidget()
	const {t} = useTranslation()

	if (isOpen) {
		return null
	}

	return (
		<button
			aria-label={t('chat.title')}
			className={cn(
				'flex h-14 w-14 items-center justify-center rounded-full',
				'bg-brand-cyan text-white shadow-lg transition-all',
				'hover:scale-105 hover:shadow-xl'
			)}
			onClick={actions.toggle}
			type='button'
		>
			<MessageSquare className='h-6 w-6' />
		</button>
	)
}

// Sub-component: Window
ChatWidget.Window = function ChatWidgetWindow({
	children
}: {
	children: React.ReactNode
}) {
	const {isOpen, isMinimized} = useChatWidget()

	if (!isOpen) {
		return null
	}

	return (
		<div
			className={cn(
				'flex flex-col bg-white rounded-lg shadow-xl',
				'transition-all duration-300',
				isMinimized ? 'h-14 w-80' : 'h-[600px] w-96'
			)}
		>
			{children}
		</div>
	)
}

// Sub-component: Header
ChatWidget.Header = function ChatWidgetHeader() {
	const {isMinimized, activeConversation, actions} = useChatWidget()
	const {t} = useTranslation()

	return (
		<div className='flex items-center justify-between border-b p-4'>
			<div className='flex items-center gap-3'>
				<MessageSquare className='h-5 w-5 text-brand-cyan' />
				<div>
					<h3 className='font-semibold text-sm'>
						{activeConversation?.title || t('chat.title')}
					</h3>
					{!isMinimized && (
						<p className='text-xs text-gray-500'>{t('chat.subtitle')}</p>
					)}
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<button
					aria-label='Minimize'
					className='p-1 hover:bg-gray-100 rounded'
					onClick={actions.minimize}
					type='button'
				>
					<Minimize2 className='h-4 w-4' />
				</button>
				<button
					aria-label='Close'
					className='p-1 hover:bg-gray-100 rounded'
					onClick={actions.close}
					type='button'
				>
					<X className='h-4 w-4' />
				</button>
			</div>
		</div>
	)
}

// Sub-component: Body
ChatWidget.Body = function ChatWidgetBody({
	children
}: {
	children: React.ReactNode
}) {
	const {isMinimized} = useChatWidget()

	if (isMinimized) {
		return null
	}

	return <div className='flex-1 flex flex-col overflow-hidden'>{children}</div>
}

// Sub-component: Conversation List
ChatWidget.ConversationList = function ChatWidgetConversationList() {
	const {conversations, activeConversation, actions} = useChatWidget()
	const {t} = useTranslation()

	if (activeConversation) {
		return null
	}

	return (
		<div className='flex-1 overflow-y-auto p-4'>
			{conversations.length === 0 ? (
				<div className='text-center text-sm text-gray-500'>
					<MessageSquare className='mx-auto mb-2 h-8 w-8 opacity-30' />
					<p>{t('chat.noConversations')}</p>
				</div>
			) : (
				<div className='space-y-2'>
					{conversations.map(conversation => (
						<button
							className={cn(
								'w-full text-left p-3 rounded-lg',
								'hover:bg-gray-50 transition-colors',
								'border border-gray-200'
							)}
							key={conversation.id}
							onClick={() => actions.selectConversation(conversation)}
							type='button'
						>
							<div className='font-medium text-sm'>{conversation.title}</div>
							<div className='text-xs text-gray-500 mt-1'>
								{conversation.lastMessage}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

// Sub-component: Messages
ChatWidget.Messages = function ChatWidgetMessages() {
	const {messages, activeConversation} = useChatWidget()

	if (!activeConversation) {
		return null
	}

	return (
		<div className='flex-1 overflow-y-auto p-4 space-y-4'>
			{messages.map(message => (
				<div
					className={cn(
						'flex',
						message.role === 'user' ? 'justify-end' : 'justify-start'
					)}
					key={message.id}
				>
					<div
						className={cn(
							'max-w-[80%] rounded-lg p-3',
							message.role === 'user'
								? 'bg-brand-cyan text-white'
								: 'bg-gray-100 text-gray-900'
						)}
					>
						<p className='text-sm'>{message.content}</p>
					</div>
				</div>
			))}
		</div>
	)
}

// Sub-component: Input
ChatWidget.Input = function ChatWidgetInput() {
	const {actions, activeConversation} = useChatWidget()
	const {t} = useTranslation()
	const [value, setValue] = React.useState('')

	if (!activeConversation) {
		return null
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (value.trim()) {
			actions.sendMessage(value.trim())
			setValue('')
		}
	}

	return (
		<form className='border-t p-4' onSubmit={handleSubmit}>
			<div className='flex gap-2'>
				<input
					className={cn(
						'flex-1 rounded-lg border border-gray-200 px-3 py-2',
						'focus:outline-none focus:ring-2 focus:ring-brand-cyan'
					)}
					onChange={e => setValue(e.target.value)}
					placeholder={t('chat.placeholder')}
					value={value}
				/>
				<button
					className={cn(
						'px-4 py-2 rounded-lg bg-brand-cyan text-white',
						'hover:bg-cyan-600 transition-colors',
						'disabled:opacity-50 disabled:cursor-not-allowed'
					)}
					disabled={!value.trim()}
					type='submit'
				>
					{t('chat.send')}
				</button>
			</div>
		</form>
	)
}

// Example usage:
/*
<ChatWidget conversations={conversations}>
  <ChatWidget.Trigger />
  <ChatWidget.Window>
    <ChatWidget.Header />
    <ChatWidget.Body>
      <ChatWidget.ConversationList />
      <ChatWidget.Messages />
      <ChatWidget.Input />
    </ChatWidget.Body>
  </ChatWidget.Window>
</ChatWidget>
*/

// Export component
export {ChatWidget}
