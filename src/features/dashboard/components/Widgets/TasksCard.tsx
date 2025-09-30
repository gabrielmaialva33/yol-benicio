import {useState} from 'react'
import {useTasks} from '../../../../shared/hooks/use-tasks'
import {DateRangePicker} from '../../../../shared/ui/DateRangePicker'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '../../../../shared/ui/primitives/Card'
import {TaskItem} from './TaskItem'

const TASKS_CARD_TITLE = 'Suas tarefas'

export function TasksCard() {
	const {displayTasks, dateRange, setDateRange, toggleTask} = useTasks()
	const [showDatePicker, setShowDatePicker] = useState(false)

	const handleToggleDatePicker = () => {
		setShowDatePicker(!showDatePicker)
	}

	return (
		<Card>
			<CardHeader className='mb-4 flex items-center justify-between'>
				<CardTitle>{TASKS_CARD_TITLE}</CardTitle>
				<DateRangePicker
					dateRange={dateRange}
					isOpen={showDatePicker}
					onDateRangeChange={setDateRange}
					onToggle={handleToggleDatePicker}
				/>
			</CardHeader>
			<CardContent className='space-y-3'>
				{displayTasks.map(task => (
					<TaskItem key={task.id} task={task} toggleTask={toggleTask} />
				))}
			</CardContent>
		</Card>
	)
}
