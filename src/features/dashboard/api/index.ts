import {API_BASE_URL} from '../../../config/api'
import {getStoredToken} from '../../../shared/api/auth'
import type {PaginatedResponse} from '../../../shared/types/api'
import type {Task} from '../../../shared/types/domain'

/**
 * Get authentication headers with Bearer token
 */
function getAuthHeaders(): HeadersInit {
	const token = getStoredToken()
	if (!token) {
		throw new Error('No authentication token found')
	}
	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json'
	}
}

/**
 * Dashboard API types
 */
export interface ActiveFoldersData {
	active: number
	newThisMonth: number
	history: Array<{
		month: string
		value: number
	}>
}

export interface AreaDivisionData {
	name: string
	value: number
	color: string
}

export interface FolderActivityData {
	label: string
	value: number
	color: string
	percentage: number
}

export interface HearingData {
	label: string
	percentage: number
	total: number
	completed: number
	color: string
	date: string
}

export interface RequestData {
	month: string
	value: number
	new: number
	percentage: number
}

export interface BirthdayData {
	avatar: string
	name: string
	email: string
}

export interface FavoriteFolderData {
	id: string
	name: string
	description?: string
	createdAt: string
	updatedAt: string
}

/**
 * Dashboard API functions
 */
export async function getActiveFoldersStats(): Promise<ActiveFoldersData> {
	const response = await fetch(`${API_BASE_URL}/api/dashboard/active-folders`, {
		headers: getAuthHeaders(),
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch active folders statistics')
	}

	return response.json()
}

export async function getFavoriteFolders(): Promise<FavoriteFolderData[]> {
	const response = await fetch(
		`${API_BASE_URL}/api/dashboard/favorite-folders`,
		{
			headers: getAuthHeaders(),
			credentials: 'include'
		}
	)

	if (!response.ok) {
		throw new Error('Failed to fetch favorite folders')
	}

	return response.json()
}

export async function getAreaDivision(): Promise<AreaDivisionData[]> {
	const response = await fetch(`${API_BASE_URL}/api/area-division`, {
		headers: getAuthHeaders(),
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch area division')
	}

	return response.json()
}

export async function getFolderActivity(): Promise<FolderActivityData[]> {
	const response = await fetch(`${API_BASE_URL}/api/folder-activity`, {
		headers: getAuthHeaders(),
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch folder activity')
	}

	return response.json()
}

export async function getTasks(): Promise<PaginatedResponse<Task>> {
	const response = await fetch(`${API_BASE_URL}/api/tasks`, {
		headers: getAuthHeaders(),
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch tasks')
	}

	return response.json()
}

export async function getRequests(): Promise<RequestData[]> {
	const response = await fetch(`${API_BASE_URL}/api/requests`, {
		headers: getAuthHeaders(),
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch requests')
	}

	return response.json()
}

export async function getHearings(): Promise<HearingData[]> {
	const response = await fetch(`${API_BASE_URL}/api/hearings`, {
		headers: getAuthHeaders(),
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch hearings')
	}

	return response.json()
}

export async function getBirthdays(): Promise<BirthdayData[]> {
	const response = await fetch(`${API_BASE_URL}/api/birthdays`, {
		headers: getAuthHeaders(),
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch birthdays')
	}

	return response.json()
}
