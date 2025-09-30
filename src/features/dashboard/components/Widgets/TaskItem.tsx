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
			className='flex items-center space-x-3 p-3 border-l-4 rounded-r'
			key={task.id}
			style={{borderColor: task.priority === 'high' ? 'red' : 'gray'}}
		>
			<button
				className={`w-6 h-6 rounded-md flex items-center justify-center ${
					isCompleted
						? 'bg-green-500 border-green-500 text-white'
						: 'bg-gray-100 border-gray-100'
				}`}
				onClick={() => toggleTask(task.id)}
				type='button'
			>
				{isCompleted && (
					<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
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
					className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}
				>
					{task.title}
				</div>
				<div className='text-sm text-gray-500'>{task.folder?.title}</div>
			</div>
			<div className='flex space-x-2'>
				<button
					className='p-2 bg-gray-100 rounded-md hover:bg-gray-200'
					type='button'
				>
					<img
						alt={COMMENT_ALT_TEXT}
						className='w-4 h-4'
						height={16}
						src={commentIcon || '/placeholder.svg'}
						width={16}
					/>
				</button>
				<button
					className='p-2 bg-gray-100 rounded-md hover:bg-gray-200'
					type='button'
				>
					<img
						alt={ATTACHMENT_ALT_TEXT}
						className='w-4 h-4'
						height={16}
						src={attachmentIcon || '/placeholder.svg'}
						width={16}
					/>
				</button>
			</div>
		</div>
	)
}
