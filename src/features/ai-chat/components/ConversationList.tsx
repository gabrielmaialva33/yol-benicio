/**
 * ConversationList Component
 * Sidebar with list of conversations
 */

import {cn} from '@ui/utils/cn'
import {MessageSquare, Plus, Trash2} from 'lucide-react'
import {Link} from 'react-router'
import type {Conversation} from '../types'

interface ConversationListProps {
	conversations: Conversation[]
	activeConversationId?: number | undefined
	onNewConversation: () => void
	onDeleteConversation: (id: number) => void
	isDeleting?: boolean | undefined
}

export function ConversationList({
	conversations,
	activeConversationId,
	onNewConversation,
	onDeleteConversation,
	isDeleting = false
}: ConversationListProps) {
	return (
		<div className='flex h-full w-64 flex-col border-r border-border bg-surface'>
			{/* Header */}
			<div className='border-b border-border p-4'>
				<button
					className='flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-2 font-semibold text-sm text-white transition-colors hover:bg-orange-600'
					onClick={onNewConversation}
					type='button'
				>
					<Plus className='h-4 w-4' />
					Nova Conversa
				</button>
			</div>

			{/* Conversations list */}
			<div className='flex-1 space-y-1 overflow-y-auto p-2'>
				{conversations.length === 0 ? (
					<div className='p-4 text-center text-sm text-gray-500'>
						<MessageSquare className='mx-auto mb-2 h-8 w-8 opacity-30' />
						<p>Nenhuma conversa ainda</p>
					</div>
				) : (
					conversations.map(conversation => (
						<div
							className={cn(
								'group flex items-center justify-between gap-2 rounded-lg p-3 transition-colors',
								activeConversationId === conversation.id
									? 'bg-brand-orange/10 text-brand-orange'
									: 'hover:bg-gray-100'
							)}
							key={conversation.id}
						>
							<Link
								className='flex-1 truncate text-sm'
								to={`/dashboard/chat/${conversation.id}`}
							>
								{conversation.title || 'Nova conversa'}
							</Link>
							<button
								className='invisible rounded p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 group-hover:visible disabled:cursor-not-allowed disabled:opacity-50'
								disabled={isDeleting}
								onClick={() => onDeleteConversation(conversation.id)}
								title='Deletar conversa'
								type='button'
							>
								<Trash2 className='h-4 w-4' />
							</button>
						</div>
					))
				)}
			</div>

			{/* Footer info */}
			<div className='border-t border-border p-3 text-xs text-gray-500'>
				{conversations.length > 0
					? `${conversations.length} conversa${conversations.length > 1 ? 's' : ''}`
					: 'Inicie uma conversa'}
			</div>
		</div>
	)
}
