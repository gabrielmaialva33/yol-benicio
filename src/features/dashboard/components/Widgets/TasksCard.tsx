import {useState} from 'react'
import {useTasks} from '../../../../shared/hooks/use-tasks'
import {DateRangePicker} from '../../../../shared/ui/DateRangePicker'
import {TaskItem} from './TaskItem'

export function TasksCard() {
	const {displayTasks, dateRange, setDateRange, toggleTask} = useTasks()
	const [showDatePicker, setShowDatePicker] = useState(false)

	const handleToggleDatePicker = () => {
		setShowDatePicker(!showDatePicker)
	}

	return (
		<div className='bg-white rounded-xl p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.03)] relative'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-900'>Suas tarefas</h3>
				<DateRangePicker
					dateRange={dateRange}
					isOpen={showDatePicker}
					onDateRangeChange={setDateRange}
					onToggle={handleToggleDatePicker}
				/>
			</div>
			<div className='space-y-3'>
				{displayTasks.map(task => (
					<TaskItem key={task.id} task={task} toggleTask={toggleTask} />
				))}
			</div>
		</div>
	)
}
