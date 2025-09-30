import {
	Clock,
	Edit3,
	FileText,
	Gavel,
	Paperclip,
	Scale,
	TrendingUp,
	UserPlus
} from 'lucide-react'

export const eventTypeConfig = {
	billing: {
		icon: TrendingUp,
		iconBg: 'bg-green-100',
		iconColor: 'text-green-600',
		borderColor: 'border-green-200'
	},
	document: {
		icon: FileText,
		iconBg: 'bg-blue-100',
		iconColor: 'text-blue-600',
		borderColor: 'border-blue-200'
	},
	hearing: {
		icon: Gavel,
		iconBg: 'bg-amber-100',
		iconColor: 'text-amber-600',
		borderColor: 'border-amber-200'
	},
	decision: {
		icon: Scale,
		iconBg: 'bg-purple-100',
		iconColor: 'text-purple-600',
		borderColor: 'border-purple-200'
	},
	party: {
		icon: UserPlus,
		iconBg: 'bg-indigo-100',
		iconColor: 'text-indigo-600',
		borderColor: 'border-indigo-200'
	},
	update: {
		icon: Edit3,
		iconBg: 'bg-gray-100',
		iconColor: 'text-gray-600',
		borderColor: 'border-gray-200'
	},
	deadline: {
		icon: Clock,
		iconBg: 'bg-red-100',
		iconColor: 'text-red-600',
		borderColor: 'border-red-200'
	},
	attachment: {
		icon: Paperclip,
		iconBg: 'bg-cyan-100',
		iconColor: 'text-cyan-600',
		borderColor: 'border-cyan-200'
	}
}

export const getEventConfig = (eventType?: string) =>
	eventTypeConfig[eventType as keyof typeof eventTypeConfig] ||
	eventTypeConfig.update
