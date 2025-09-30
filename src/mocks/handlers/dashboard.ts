import {DateTime} from 'luxon'
import {HttpResponse, http} from 'msw'
import type {ApiResponse} from '../../shared/types/api'
import type {DashboardStats} from '../../shared/types/domain'
import {
	FolderArea,
	FolderStatus,
	TaskPriority,
	TaskStatus
} from '../../shared/types/domain'
import {generateClients} from '../generators/clients'
import {areaNames} from '../generators/folders'
import {generateTasks} from '../generators/tasks'
import {allFolders as folders} from './folders'

// Constants
const _PERCENTAGE_MULTIPLIER = 100

// Generate mock data for statistics
const TOTAL_TASKS = 200
const TOTAL_CLIENTS = 80
// Using folders from folders.ts to ensure consistency
const tasks = generateTasks(TOTAL_TASKS)
const clients = generateClients(TOTAL_CLIENTS)

export const dashboardHandlers = [
	// Main dashboard stats
	http.get('/api/dashboard/stats', () => {
		const now = DateTime.now()
		const thisMonth = now.startOf('month')

		const stats: DashboardStats = {
			folders: {
				total: folders.length,
				active: folders.filter(f => f.status === FolderStatus.ACTIVE).length,
				completed: folders.filter(f => f.status === FolderStatus.COMPLETED)
					.length,
				new_this_month: folders.filter(
					f => DateTime.fromISO(f.created_at) >= thisMonth
				).length,
				by_area: Object.values(FolderArea).map(area => ({
					area,
					count: folders.filter(f => f.area === area).length,
					percentage:
						(folders.filter(f => f.area === area).length / folders.length) *
						_PERCENTAGE_MULTIPLIER
				})),
				by_status: Object.values(FolderStatus).map(status => ({
					status,
					count: folders.filter(f => f.status === status).length,
					percentage:
						(folders.filter(f => f.status === status).length / folders.length) *
						_PERCENTAGE_MULTIPLIER
				})),
				monthly_evolution: generateMonthlyEvolution()
			},
			tasks: {
				total: tasks.length,
				pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
				completed_today: tasks.filter(
					t =>
						t.status === TaskStatus.COMPLETED &&
						t.completed_at &&
						DateTime.fromISO(t.completed_at).hasSame(now, 'day')
				).length,
				overdue: tasks.filter(
					t =>
						t.status !== TaskStatus.COMPLETED &&
						DateTime.fromISO(t.due_date) < now
				).length,
				by_priority: Object.values(TaskPriority).map(priority => ({
					priority,
					count: tasks.filter(t => t.priority === priority).length
				}))
			},
			hearings: {
				upcoming: 15, // Static mock for now
				this_week: 3,
				this_month: 8
			},
			clients: {
				total: clients.length,
				active: clients.filter(c => c.active_folders_count > 0).length,
				new_this_month: clients.filter(
					c => DateTime.fromISO(c.created_at) >= thisMonth
				).length
			}
		}

		const response: ApiResponse<DashboardStats> = {data: stats}
		return HttpResponse.json(response)
	}),

	// Favorite folders widget
	http.get('/api/dashboard/favorite-folders', () => {
		const FavoriteFoldersCount = 6
		const colors = [
			'#008980',
			'#2FAC68',
			'#F6C000',
			'#5A5DFF',
			'#FF5A5D',
			'#FF8A00'
		]
		const favoriteFolders = folders
			.filter(f => f.is_favorite)
			.slice(0, FavoriteFoldersCount)
			.map((f, index) => ({
				id: f.id,
				code: f.code,
				title: f.title,
				client_name: f.client.name,
				status: f.status,
				documents_count: f.documents_count,
				color: colors[index] || '#86878B'
			}))

		return HttpResponse.json(favoriteFolders)
	}),

	// Urgent tasks widget
	http.get('/api/dashboard/urgent-tasks', () => {
		const UrgentTasksCount = 10
		const urgentTasks = tasks
			.filter(
				t =>
					t.status !== TaskStatus.COMPLETED &&
					(t.priority === TaskPriority.URGENT ||
						t.priority === TaskPriority.HIGH)
			)
			.sort(
				(a, b) =>
					DateTime.fromISO(a.due_date).toMillis() -
					DateTime.fromISO(b.due_date).toMillis()
			)
			.slice(0, UrgentTasksCount)
			.map(t => ({
				id: t.id,
				title: t.title,
				due_date: t.due_date,
				priority: t.priority,
				assigned_to_name: t.assigned_to.full_name,
				folder_code: t.folder?.code
			}))

		const response: ApiResponse<typeof urgentTasks> = {data: urgentTasks}
		return HttpResponse.json(response)
	}),

	// Recent activity widget
	http.get('/api/dashboard/recent-activity', () => {
		const activities = generateRecentActivities()
		const response: ApiResponse<typeof activities> = {data: activities}
		return HttpResponse.json(response)
	}),

	// Birthdays widget
	http.get('/api/dashboard/birthdays', () => {
		const today = DateTime.now()
		const BirthdaysCount = 5
		const birthdays = clients
			.filter(c => {
				if (!c.metadata.birthday || c.metadata.type !== 'individual') {
					return false
				}
				const birthday = DateTime.fromISO(c.metadata.birthday)
				return birthday.month === today.month
			})
			.map(c => ({
				id: c.id,
				name: c.name,
				birthday: c.metadata.birthday ?? '',
				age: calculateAge(c.metadata.birthday ?? '')
			}))
			.slice(0, BirthdaysCount)

		const response: ApiResponse<typeof birthdays> = {data: birthdays}
		return HttpResponse.json(response)
	}),

	// Area division - for pie chart
	http.get('/api/area-division', () => {
		const HundredPercent = 100
		const areaDivision = Object.values(FolderArea)
			.map(area => {
				const count = folders.filter(f => f.area === area).length
				const percentage = Math.round((count / folders.length) * HundredPercent)

				const colors: Record<string, string> = {
					[FolderArea.CIVIL_LITIGATION]: '#14B8A6',
					[FolderArea.CRIMINAL]: '#F43F5E',
					[FolderArea.LABOR]: '#8B5CF6',
					[FolderArea.ADMINISTRATIVE]: '#F59E0B',
					[FolderArea.CONSUMER]: '#3B82F6',
					[FolderArea.ENVIRONMENTAL]: '#10B981',
					[FolderArea.CORPORATE]: '#6366F1',
					[FolderArea.TAX]: '#EC4899',
					[FolderArea.FAMILY]: '#84CC16',
					[FolderArea.INTELLECTUAL_PROPERTY]: '#A855F7',
					[FolderArea.REAL_ESTATE]: '#EAB308',
					[FolderArea.INTERNATIONAL]: '#06B6D4'
				}

				return {
					name: areaNames[area],
					value: percentage,
					color: colors[area] || '#6B7280'
				}
			})
			.filter(item => item.value > 0)

		return HttpResponse.json(areaDivision)
	}),

	// Folder activity
	http.get('/api/folder-activity', () => {
		const now = DateTime.now()
		const oneWeekAgo = now.minus({weeks: 1})
		const oneMonthAgo = now.minus({months: 1})

		const newThisWeek = folders.filter(
			f => DateTime.fromISO(f.created_at) >= oneWeekAgo
		).length
		const newThisMonth = folders.filter(
			f => DateTime.fromISO(f.created_at) >= oneMonthAgo
		).length
		const completedThisMonth = folders.filter(
			f =>
				f.status === FolderStatus.COMPLETED &&
				f.updated_at &&
				DateTime.fromISO(f.updated_at) >= oneMonthAgo
		).length

		const HundredPercent = 100
		const activities = [
			{
				label: 'Novas esta semana',
				value: newThisWeek,
				color: 'bg-cyan-500',
				percentage: Math.round((newThisWeek / folders.length) * HundredPercent)
			},
			{
				label: 'Novas este mês',
				value: newThisMonth,
				color: 'bg-purple-500',
				percentage: Math.round((newThisMonth / folders.length) * HundredPercent)
			},
			{
				label: 'Concluídas este mês',
				value: completedThisMonth,
				color: 'bg-emerald-500',
				percentage: Math.round(
					(completedThisMonth / folders.length) * HundredPercent
				)
			},
			{
				label: 'Total ativo',
				value: folders.filter(f => f.status === FolderStatus.ACTIVE).length,
				color: 'bg-blue-500',
				percentage: Math.round(
					(folders.filter(f => f.status === FolderStatus.ACTIVE).length /
						folders.length) *
						HundredPercent
				)
			}
		]

		return HttpResponse.json(activities)
	}),

	// Requests - for area chart
	http.get('/api/requests', () => {
		const months = [
			'Jan',
			'Fev',
			'Mar',
			'Abr',
			'Mai',
			'Jun',
			'Jul',
			'Ago',
			'Set',
			'Out',
			'Nov',
			'Dez'
		]
		const currentMonth = DateTime.now().month - 1 // 0-indexed

		const requestsData = months
			.slice(0, currentMonth + 1)
			.map((month, index) => {
				// Simulate growing data with some variation
				const BaseValueStart = 10
				const BaseValueMultiplier = 1.5
				const BaseValueRandom = 4
				const NewRequestsRandom = 5
				const NewRequestsOffset = 3
				const PercentageDivisor = 20
				const HundredPercent = 100
				const baseValue =
					BaseValueStart +
					index * BaseValueMultiplier +
					Math.random() * BaseValueRandom
				const newRequests =
					Math.floor(Math.random() * NewRequestsRandom) + NewRequestsOffset

				return {
					month,
					value: Math.round(baseValue),
					new: newRequests,
					percentage: Math.round(
						(newRequests / PercentageDivisor) * HundredPercent
					)
				}
			})

		return HttpResponse.json(requestsData)
	}),

	// Hearings and deadlines
	http.get('/api/hearings', () => {
		const now = DateTime.now()

		// Simulate hearings and deadlines data
		const HearingsPercentage = 75
		const HearingsTotal = 12
		const HearingsCompleted = 9
		const HearingsDays = 5
		const ProceduralDeadlinesPercentage = 60
		const ProceduralDeadlinesTotal = 20
		const ProceduralDeadlinesCompleted = 12
		const ProceduralDeadlinesDays = 10
		const AdministrativeDeadlinesPercentage = 90
		const AdministrativeDeadlinesTotal = 10
		const AdministrativeDeadlinesCompleted = 9
		const AdministrativeDeadlinesDays = 15
		const hearingsData = [
			{
				label: 'Audiências',
				percentage: HearingsPercentage,
				total: HearingsTotal,
				completed: HearingsCompleted,
				color: '#14B8A6',
				date: now.plus({days: HearingsDays}).toISO()
			},
			{
				label: 'Prazos processuais',
				percentage: ProceduralDeadlinesPercentage,
				total: ProceduralDeadlinesTotal,
				completed: ProceduralDeadlinesCompleted,
				color: '#F43F5E',
				date: now.plus({days: ProceduralDeadlinesDays}).toISO()
			},
			{
				label: 'Prazos administrativos',
				percentage: AdministrativeDeadlinesPercentage,
				total: AdministrativeDeadlinesTotal,
				completed: AdministrativeDeadlinesCompleted,
				color: '#8B5CF6',
				date: now.plus({days: AdministrativeDeadlinesDays}).toISO()
			}
		]

		return HttpResponse.json(hearingsData)
	}),

	// Birthdays - simplified format for widget
	http.get('/api/birthdays', () => {
		const avatarOptions = ['Circle', 'Transparent']
		const topTypes = [
			'ShortHairShortCurly',
			'ShortHairShortFlat',
			'ShortHairShortWaved',
			'LongHairStraight',
			'LongHairCurly',
			'LongHairBob'
		]
		const hairColors = ['Black', 'Blonde', 'Brown', 'BrownDark', 'Auburn']
		const accessories = [
			'Prescription01',
			'Prescription02',
			'Wayfarers',
			'Blank'
		]
		const facialHairTypes = [
			'Blank',
			'BeardLight',
			'BeardMedium',
			'MoustacheMagnum'
		]
		const clotheTypes = [
			'BlazerShirt',
			'BlazerSweater',
			'CollarSweater',
			'GraphicShirt',
			'Hoodie'
		]
		const clotheColors = [
			'Black',
			'Blue01',
			'Blue02',
			'Blue03',
			'Gray01',
			'Gray02',
			'Heather',
			'PastelBlue',
			'PastelGreen',
			'PastelOrange',
			'PastelRed',
			'PastelYellow',
			'Pink',
			'Red',
			'White'
		]
		const eyeTypes = [
			'Default',
			'Happy',
			'Wink',
			'Surprised',
			'Hearts',
			'EyeRoll'
		]
		const eyebrowTypes = [
			'Default',
			'DefaultNatural',
			'FlatNatural',
			'RaisedExcited',
			'RaisedExcitedNatural',
			'SadConcerned',
			'SadConcernedNatural'
		]
		const mouthTypes = [
			'Default',
			'Smile',
			'Twinkle',
			'Serious',
			'Sad',
			'Concerned'
		]
		const skinColors = [
			'Tanned',
			'Yellow',
			'Pale',
			'Light',
			'Brown',
			'DarkBrown',
			'Black'
		]

		const generateAvatarUrl = () => {
			const params: Record<string, string> = {
				avatarStyle:
					avatarOptions[Math.floor(Math.random() * avatarOptions.length)] ?? '',
				topType: topTypes[Math.floor(Math.random() * topTypes.length)] ?? '',
				accessoriesType:
					accessories[Math.floor(Math.random() * accessories.length)] ?? '',
				hairColor:
					hairColors[Math.floor(Math.random() * hairColors.length)] ?? '',
				facialHairType:
					facialHairTypes[Math.floor(Math.random() * facialHairTypes.length)] ??
					'',
				facialHairColor:
					hairColors[Math.floor(Math.random() * hairColors.length)] ?? '',
				clotheType:
					clotheTypes[Math.floor(Math.random() * clotheTypes.length)] ?? '',
				clotheColor:
					clotheColors[Math.floor(Math.random() * clotheColors.length)] ?? '',
				graphicType: 'Skull',
				eyeType: eyeTypes[Math.floor(Math.random() * eyeTypes.length)] ?? '',
				eyebrowType:
					eyebrowTypes[Math.floor(Math.random() * eyebrowTypes.length)] ?? '',
				mouthType:
					mouthTypes[Math.floor(Math.random() * mouthTypes.length)] ?? '',
				skinColor:
					skinColors[Math.floor(Math.random() * skinColors.length)] ?? ''
			}
			return `https://avataaars.io/?${new URLSearchParams(params).toString()}`
		}

		const birthdayPeople = [
			{
				avatar: generateAvatarUrl(),
				name: 'Maria Silva',
				email: 'maria.silva@benicio.com.br'
			},
			{
				avatar: generateAvatarUrl(),
				name: 'João Santos',
				email: 'joao.santos@benicio.com.br'
			},
			{
				avatar: generateAvatarUrl(),
				name: 'Ana Costa',
				email: 'ana.costa@benicio.com.br'
			},
			{
				avatar: generateAvatarUrl(),
				name: 'Pedro Oliveira',
				email: 'pedro.oliveira@benicio.com.br'
			}
		]

		return HttpResponse.json(birthdayPeople)
	}),

	// Favorite clients for sidebar
	http.get('/api/dashboard/favorite-clients', () => {
		// Get unique clients with folder counts
		const clientsMap = new Map<
			number,
			{id: number; name: string; folderCount: number}
		>()

		for (const folder of folders) {
			const clientId = folder.client.id
			if (!clientsMap.has(clientId)) {
				clientsMap.set(clientId, {
					id: clientId,
					name: folder.client.name,
					folderCount: 0
				})
			}
			const client = clientsMap.get(clientId)
			if (client) {
				client.folderCount++
			}
		}

		// Get top 6 clients by folder count and assign colors
		const colors = [
			'#008980',
			'#2FAC68',
			'#F6C000',
			'#5A5DFF',
			'#FF5A5D',
			'#FF8A00'
		]
		const FavoriteClientsCount = 6
		const favoriteClients = Array.from(clientsMap.values())
			.sort((a, b) => b.folderCount - a.folderCount)
			.slice(0, FavoriteClientsCount)
			.map((client, index) => ({
				...client,
				color: colors[index]
			}))

		return HttpResponse.json(favoriteClients)
	}),

	// Active folders widget
	http.get('/api/dashboard/active-folders', () => {
		const now = DateTime.now()
		const thisMonth = now.startOf('month')

		// Count active folders
		const activeFolders = folders.filter(
			f => f.status === FolderStatus.ACTIVE
		).length

		// Count new folders this month
		const newThisMonth = folders.filter(
			f => DateTime.fromISO(f.created_at) >= thisMonth
		).length

		// Generate history for the last 6 months
		const HistoryMonths = 6
		const history: Array<{month: string; value: number}> = []
		for (let i = HistoryMonths - 1; i >= 0; i--) {
			const monthDate = now.minus({months: i})
			const monthStart = monthDate.startOf('month')
			const monthEnd = monthDate.endOf('month')

			const monthFolders = folders.filter(f => {
				const createdDate = DateTime.fromISO(f.created_at)
				return createdDate >= monthStart && createdDate <= monthEnd
			}).length

			history.push({
				month: monthDate.toFormat('MMM'),
				value: monthFolders
			})
		}

		return HttpResponse.json({
			active: activeFolders,
			newThisMonth,
			history
		})
	})
]

function generateMonthlyEvolution() {
	const months = [
		'Jan',
		'Fev',
		'Mar',
		'Abr',
		'Mai',
		'Jun',
		'Jul',
		'Ago',
		'Set',
		'Out',
		'Nov',
		'Dez'
	]
	const currentMonth = DateTime.now().month - 1 // 0-indexed
	const RandomMultiplier = 20
	const BaseCount = 10
	const IndexMultiplier = 2

	return months.slice(0, currentMonth + 1).map((month, index) => ({
		month,
		count:
			Math.floor(Math.random() * RandomMultiplier) +
			BaseCount +
			index * IndexMultiplier
	}))
}

function generateRecentActivities() {
	const activityTypes = [
		{type: 'folder_created', message: 'New folder created'},
		{type: 'task_completed', message: 'Task completed'},
		{type: 'document_uploaded', message: 'Document uploaded'},
		{type: 'hearing_scheduled', message: 'Hearing scheduled'},
		{type: 'client_added', message: 'New client added'}
	]
	const RecentActivitiesCount = 10

	return Array.from({length: RecentActivitiesCount}, (_, i) => {
		const activityIndex = Math.floor(Math.random() * activityTypes.length)
		const activity = activityTypes[activityIndex]
		const folderIndex = Math.floor(Math.random() * folders.length)
		const randomFolder = folders[folderIndex]

		if (!(activity && randomFolder)) {
			return {
				id: i + 1,
				type: 'system',
				message: 'System activity',
				user_name: 'System',
				created_at: DateTime.now().minus({hours: i}).toISO()
			}
		}

		return {
			id: i + 1,
			type: activity.type,
			message: `${activity.message}: ${randomFolder.code}`,
			user_name: randomFolder.responsible_lawyer.full_name,
			created_at: DateTime.now().minus({hours: i}).toISO()
		}
	})
}

function calculateAge(birthday: string): number {
	if (!birthday) {
		return 0
	}
	const today = DateTime.now()
	const birthDate = DateTime.fromISO(birthday)

	const age: number = today.year - birthDate.year

	// Check if birthday hasn't occurred this year yet
	if (today < birthDate.set({year: today.year})) {
		return age - 1
	}

	return age
}
