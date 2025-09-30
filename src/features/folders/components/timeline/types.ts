import type {FolderMovement} from '../../types/folder.types'

export interface TimelineEventData extends FolderMovement {
	id: string
	title: string
	subtitle?: string
	referenceNumber?: string
	addedBy: {
		name: string
		avatar?: string
	}
	category?: string[]
	documents?: {
		id: string
		name: string
		type: 'pdf' | 'doc' | 'image'
		size: string
	}[]
	status?: 'success' | 'info' | 'warning' | 'error' | 'neutral'
	actionText?: string
	actionDescription?: string
	eventType?:
		| 'billing'
		| 'document'
		| 'hearing'
		| 'decision'
		| 'party'
		| 'update'
		| 'deadline'
		| 'attachment'
}
