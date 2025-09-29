import {DateTime} from 'luxon'
import {HttpResponse, http} from 'msw'
import type {ApiResponse} from '../../shared/types/api'
import type {Task} from '../../shared/types/domain'
import {TaskPriority, TaskStatus} from '../../shared/types/domain'
import {generateTasks} from '../generators/tasks'
import {
	applyFilters,
	applySorting,
	createPaginatedResponse,
	parseQueryParams
} from '../helpers/pagination'

// Generate mock data
const TOTAL_TASKS = 200
const allTasks = generateTasks(TOTAL_TASKS)

// Filter functions
const taskFilters = {
	search: (task: Task, value: unknown) => {
		const searchLower = String(value).toLowerCase()
		return (
			task.title.toLowerCase().includes(searchLower) ||
			(task.description?.toLowerCase().includes(searchLower) ?? false)
		)
	},
	status: (task: Task, value: unknown) => task.status === value,
	priority: (task: Task, value: unknown) => task.priority === value,
	assigned_to: (task: Task, value: unknown) =>
		task.assigned_to.id === Number(value),
	folder_id: (task: Task, value: unknown) => task.folder?.id === Number(value),
	due_date_from: (task: Task, value: unknown) =>
		DateTime.fromISO(task.due_date) >= DateTime.fromISO(String(value)),
	due_date_to: (task: Task, value: unknown) =>
		DateTime.fromISO(task.due_date) <= DateTime.fromISO(String(value)),
	overdue: (task: Task, value: unknown) => {
		if (value !== 'true') {
			return true
		}
		return (
			task.status !== TaskStatus.COMPLETED &&
			DateTime.fromISO(task.due_date) < DateTime.now()
		)
	}
}

export const taskHandlers = [
	// List tasks with pagination and filters
	http.get('/api/tasks', ({request}) => {
		const url = new URL(request.url)
		const {page, perPage, sortBy, order, filters} = parseQueryParams(url)

		let filteredTasks = applyFilters(allTasks, filters, taskFilters)
		filteredTasks = applySorting(filteredTasks, sortBy || 'due_date', order)

		const response = createPaginatedResponse({
			data: filteredTasks,
			page,
			perPage,
			baseUrl: '/api/tasks'
		})

		return HttpResponse.json(response)
	}),

	// Find task by ID
	http.get('/api/tasks/:id', ({params}) => {
		const {id} = params
		const task = allTasks.find(t => t.id === Number(id))

		if (!task) {
			return HttpResponse.json(
				{errors: [{message: 'Task not found'}]},
				{status: 404}
			)
		}

		const response: ApiResponse<Task> = {data: task}
		return HttpResponse.json(response)
	}),

	// Create new task
	http.post('/api/tasks', async ({request}) => {
		const body = (await request.json()) as Partial<Task>

		const newTask: Task = {
			...body,
			id: Math.max(...allTasks.map(t => t.id)) + 1,
			status: TaskStatus.PENDING,
			created_at: DateTime.now().toISO(),
			updated_at: DateTime.now().toISO()
		} as Task

		allTasks.push(newTask)

		const response: ApiResponse<Task> = {data: newTask}
		return HttpResponse.json(response, {status: 201})
	}),

	// Update task
	http.put('/api/tasks/:id', async ({params, request}) => {
		const {id} = params
		const body = (await request.json()) as Partial<Task>

		const taskIndex = allTasks.findIndex(t => t.id === Number(id))
		if (taskIndex === -1) {
			return HttpResponse.json(
				{errors: [{message: 'Task not found'}]},
				{status: 404}
			)
		}

		const existingTask = allTasks[taskIndex]
		if (!existingTask) {
			return HttpResponse.json(
				{errors: [{message: 'Task not found'}]},
				{status: 404}
			)
		}

		// If marking as complete, add completed_at
		if (body.status === TaskStatus.COMPLETED && !existingTask.completed_at) {
			body.completed_at = DateTime.now().toISO()
		}

		const updatedTask = {
			...existingTask,
			...body,
			updated_at: DateTime.now().toISO()
		}
		allTasks[taskIndex] = updatedTask

		const response: ApiResponse<Task> = {data: updatedTask}
		return HttpResponse.json(response)
	}),

	// Mark task as complete
	http.patch('/api/tasks/:id/complete', ({params}) => {
		const {id} = params
		const task = allTasks.find(t => t.id === Number(id))

		if (!task) {
			return HttpResponse.json(
				{errors: [{message: 'Task not found'}]},
				{status: 404}
			)
		}

		const updatedTask = {
			...task,
			status: TaskStatus.COMPLETED,
			completed_at: DateTime.now().toISO(),
			updated_at: DateTime.now().toISO()
		}

		// Update in array
		const index = allTasks.findIndex(t => t.id === task.id)
		if (index !== -1) {
			allTasks[index] = updatedTask
		}

		const response: ApiResponse<Task> = {data: updatedTask}
		return HttpResponse.json(response)
	}),

	// Delete task
	http.delete('/api/tasks/:id', ({params}) => {
		const {id} = params
		const taskIndex = allTasks.findIndex(t => t.id === Number(id))

		if (taskIndex === -1) {
			return HttpResponse.json(
				{errors: [{message: 'Task not found'}]},
				{status: 404}
			)
		}

		allTasks.splice(taskIndex, 1)
		return new HttpResponse(null, {status: 204})
	}),

	// Task dashboard
	http.get('/api/tasks/dashboard', () => {
		const now = DateTime.now()
		const today = now.startOf('day')
		const tomorrow = today.plus({days: 1})

		const stats = {
			total: allTasks.length,
			pending: allTasks.filter(t => t.status === TaskStatus.PENDING).length,
			in_progress: allTasks.filter(t => t.status === TaskStatus.IN_PROGRESS)
				.length,
			completed: allTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
			completed_today: allTasks.filter(
				t =>
					t.status === TaskStatus.COMPLETED &&
					t.completed_at &&
					DateTime.fromISO(t.completed_at) >= today
			).length,
			overdue: allTasks.filter(
				t =>
					t.status !== TaskStatus.COMPLETED &&
					DateTime.fromISO(t.due_date) < now
			).length,
			due_today: allTasks.filter(t => {
				const dueDate = DateTime.fromISO(t.due_date)
				return (
					t.status !== TaskStatus.COMPLETED &&
					dueDate >= today &&
					dueDate < tomorrow
				)
			}).length,
			by_priority: Object.values(TaskPriority).map(priority => ({
				priority,
				count: allTasks.filter(t => t.priority === priority).length
			}))
		}

		const response: ApiResponse<typeof stats> = {data: stats}
		return HttpResponse.json(response)
	})
]
