import commentIcon from '/icons/comment.svg'
import attachmentIcon from '/icons/paperclip.svg'
import type {Task} from '../../../../shared/types/domain'

const COMPLETED_TITLE = 'Concluído'
const COMMENT_ALT_TEXT = 'Comentário'
const ATTACHMENT_ALT_TEXT = 'Anexo'

interface TaskItemProps {
	task: Task
	toggleTask: (id: number) => void
}

export function TaskItem({task, toggleTask}: TaskItemProps) {
	const isCompleted = task.status === 'completed'

	return (
		<div
			className='flex items-center space-x-3 rounded-r border-l-4 p-3'
			key={task.id}
			style={{borderColor: task.priority === 'high' ? 'red' : 'gray'}}
		>
			<button
				className={`flex h-6 w-6 items-center justify-center rounded-md ${
					isCompleted
						? 'border-green-500 bg-green-500 text-white'
						: 'border-gray-100 bg-gray-100'
				}`}
				onClick={() => toggleTask(task.id)}
				type='button'
			>
				{isCompleted && (
					<svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
						<title>{COMPLETED_TITLE}</title>
						<path
							clipRule='evenodd'
							d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
							fillRule='evenodd'
						/>
					</svg>
				)}
			</button>
			<div className='flex-1'>
				<div
					className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}
				>
					{task.title}
				</div>
				<div className='text-gray-500 text-sm'>{task.folder?.title}</div>
			</div>
			<div className='flex space-x-2'>
				<button
					className='rounded-md bg-gray-100 p-2 hover:bg-gray-200'
					type='button'
				>
					<img
						alt={COMMENT_ALT_TEXT}
						className='h-4 w-4'
						height={16}
						src={commentIcon || '/placeholder.svg'}
						width={16}
					/>
				</button>
				<button
					className='rounded-md bg-gray-100 p-2 hover:bg-gray-200'
					type='button'
				>
					<img
						alt={ATTACHMENT_ALT_TEXT}
						className='h-4 w-4'
						height={16}
						src={attachmentIcon || '/placeholder.svg'}
						width={16}
					/>
				</button>
			</div>
		</div>
	)
}
