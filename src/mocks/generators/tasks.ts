import {faker} from '@faker-js/faker/locale/pt_BR'
import {DateTime} from 'luxon'
import type {Task} from '../../shared/types/domain'
import {TaskPriority, TaskStatus} from '../../shared/types/domain'
import {generateFolder} from './folders'
import {generateUser} from './users'

const taskTemplates = [
	{title: 'Elaborar petição inicial', estimatedHours: 4},
	{title: 'Revisar contrato', estimatedHours: 2},
	{title: 'Preparar defesa', estimatedHours: 6},
	{title: 'Analisar documentos', estimatedHours: 3},
	{title: 'Protocolar recurso', estimatedHours: 2},
	{title: 'Agendar reunião com cliente', estimatedHours: 1},
	{title: 'Elaborar parecer jurídico', estimatedHours: 4},
	{title: 'Acompanhar prazo processual', estimatedHours: 1},
	{title: 'Digitalizar documentos', estimatedHours: 2},
	{title: 'Preparar apresentação para audiência', estimatedHours: 3},
	{title: 'Contactar testemunhas', estimatedHours: 2},
	{title: 'Solicitar certidões', estimatedHours: 1},
	{title: 'Elaborar contrato de honorários', estimatedHours: 1},
	{title: 'Revisar cálculos', estimatedHours: 2},
	{title: 'Preparar quesitos para perícia', estimatedHours: 3}
]

export function generateTask(overrides?: Partial<Task>): Task {
	const MinHourMultiplier = 0.5
	const MaxHourMultiplier = 1.5
	const MultipleOf = 0.5

	const template = faker.helpers.arrayElement(taskTemplates)
	const status = faker.helpers.arrayElement(Object.values(TaskStatus))
	const priority = faker.helpers.arrayElement(Object.values(TaskPriority))

	const createdAt = faker.date.past({years: 1})
	const dueDate = faker.date.between({
		from: createdAt,
		to: faker.date.future({years: 1})
	})

	const isCompleted = status === TaskStatus.COMPLETED
	const completedAt = isCompleted
		? faker.date.between({from: createdAt, to: DateTime.now().toJSDate()})
		: undefined

	const hasFolder = faker.datatype.boolean({probability: 0.8})
	const folder = hasFolder ? generateFolder() : undefined

	const assignedTo = overrides?.assigned_to || generateUser()
	const createdBy = overrides?.created_by || generateUser()

	const hasDescription = faker.datatype.boolean({probability: 0.7})

	const checklistItems = faker.helpers.arrayElements(
		[
			'Verificar documentação',
			'Conferir prazos',
			'Validar informações',
			'Revisar texto',
			'Aprovar com supervisor',
			'Protocolar no sistema'
		],
		{min: 0, max: 4}
	)

	return {
		id: faker.number.int({min: 1, max: 10_000}),
		title: template.title,
		...(hasDescription && {description: faker.lorem.paragraph()}),
		due_date: dueDate.toISOString(),
		status,
		priority,
		...(folder && {folder}),
		assigned_to: assignedTo,
		created_by: createdBy,
		...(completedAt && {completed_at: completedAt.toISOString()}),
		metadata: {
			estimated_hours: template.estimatedHours,
			...(isCompleted && {
				actual_hours: faker.number.float({
					min: template.estimatedHours * MinHourMultiplier,
					max: template.estimatedHours * MaxHourMultiplier,
					multipleOf: MultipleOf
				})
			}),
			tags: generateTaskTags(priority, status),
			checklist: checklistItems.map(text => ({
				id: faker.string.uuid(),
				text,
				completed: isCompleted || faker.datatype.boolean({probability: 0.3})
			}))
		},
		created_at: createdAt.toISOString(),
		updated_at: faker.date
			.between({from: createdAt, to: DateTime.now().toJSDate()})
			.toISOString(),
		...overrides
	}
}

function generateTaskTags(
	priority: TaskPriority,
	status: TaskStatus
): string[] {
	const tags: string[] = []

	if (priority === TaskPriority.URGENT || priority === TaskPriority.HIGH) {
		tags.push('importante')
	}

	if (status === TaskStatus.PENDING) {
		tags.push('pendente')
	}

	if (faker.datatype.boolean({probability: 0.3})) {
		tags.push(
			...faker.helpers.arrayElements(
				['prazo', 'cliente', 'tribunal', 'interno'],
				{min: 1, max: 2}
			)
		)
	}

	return tags
}

export function generateTasks(count: number): Task[] {
	return Array.from({length: count}, () => generateTask())
}
