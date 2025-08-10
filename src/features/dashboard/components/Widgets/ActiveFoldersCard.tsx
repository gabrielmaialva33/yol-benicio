import {useQuery} from '@tanstack/react-query'
import {CartesianGrid, Line, LineChart, ResponsiveContainer} from 'recharts'

interface FolderData {
	active: number
	newThisMonth: number
	history: {
		month: string
		value: number
	}[]
}

async function getActiveFoldersStats(): Promise<FolderData> {
	const response = await fetch('/api/dashboard/active-folders')
	return response.json()
}

export function ActiveFoldersCard() {
	const {data: folders} = useQuery<FolderData>({
		queryKey: ['active-folders-stats'],
		queryFn: getActiveFoldersStats,
		initialData: {
			active: 0,
			newThisMonth: 0,
			history: []
		}
	})

	return (
		<div className='bg-white rounded-xl p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.03)] flex flex-col justify-between'>
			<div>
				<h3 className='text-lg font-semibold text-gray-900 mb-2'>
					Pastas ativas
				</h3>
				<div className='text-5xl font-bold text-[#1F2A37]'>
					{folders?.active}
				</div>
				<div className='text-sm text-[#5E6278]'>
					{folders?.newThisMonth} novos neste mês
				</div>
			</div>
			<div className='h-24 -mx-6 mb-2'>
				<ResponsiveContainer height='100%' width='100%'>
					<LineChart data={folders?.history}>
						<CartesianGrid strokeDasharray='3 3' vertical={false} />
						<Line
							dataKey='value'
							dot={false}
							stroke='#06B6D4'
							strokeWidth={2}
							type='monotone'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
			<button
				className='text-sm font-medium text-[#1CD6F4] underline'
				type='button'
			>
				Visualizar pastas
			</button>
		</div>
	)
}
