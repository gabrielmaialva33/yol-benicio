import {useQuery} from '@tanstack/react-query'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '../../../../shared/ui/primitives/Card'
import {type FolderActivityData, getFolderActivity} from '../../api'

const CARD_TITLE = 'Atividade de Pastas'

export function FolderActivityCard() {
	const {data: activities = []} = useQuery<FolderActivityData[]>({
		queryKey: ['folderActivity'],
		queryFn: getFolderActivity
	})

	return (
		<Card>
			<CardHeader className='mb-4'>
				<CardTitle>{CARD_TITLE}</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				{activities.map(activity => (
					<div key={activity.label}>
						<div className='mb-2 flex items-center justify-between'>
							<span className='font-medium text-gray-600 text-sm'>
								{activity.label}
							</span>
							<span className='font-bold text-gray-900 text-lg'>
								{activity.value}
							</span>
						</div>
						<div className='h-2 w-full rounded-full bg-gray-200'>
							<div
								className={`h-2 rounded-full ${activity.color}`}
								style={{width: `${activity.percentage}%`}}
							/>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
