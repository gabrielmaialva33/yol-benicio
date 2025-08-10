import {useQuery} from '@tanstack/react-query'

interface FolderActivity {
	label: string
	value: number
	color: string
	percentage: number
}

async function getFolderActivity(): Promise<FolderActivity[]> {
	const response = await fetch('/api/folder-activity')
	return response.json()
}

export function FolderActivityCard() {
	const {data: activities = []} = useQuery<FolderActivity[]>({
		queryKey: ['folderActivity'],
		queryFn: getFolderActivity
	})

	return (
		<div className='bg-white rounded-xl p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.03)]'>
			<h3 className='text-lg font-semibold text-gray-900 mb-4'>
				Atividade de Pastas
			</h3>
			<div className='space-y-4'>
				{activities.map(activity => (
					<div key={activity.label}>
						<div className='flex justify-between items-center mb-2'>
							<span className='text-sm font-medium text-gray-600'>
								{activity.label}
							</span>
							<span className='text-lg font-bold text-gray-900'>
								{activity.value}
							</span>
						</div>
						<div className='w-full bg-gray-200 rounded-full h-2'>
							<div
								className={`h-2 rounded-full ${activity.color}`}
								style={{width: `${activity.percentage}%`}}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
