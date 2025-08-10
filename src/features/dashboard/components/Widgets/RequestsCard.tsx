import {useQuery} from '@tanstack/react-query'
import {useEffect, useId, useState} from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

interface Request {
	month: string
	value: number
	new: number
	percentage: number
}

async function getRequests(): Promise<Request[]> {
	const response = await fetch('/api/requests')
	return response.json()
}

export function RequestsCard() {
	const {data: requests = []} = useQuery<Request[]>({
		queryKey: ['requests'],
		queryFn: getRequests
	})
	const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
	const id = useId()

	useEffect(() => {
		if (requests.length > 0) {
			setCurrentMonthIndex(requests.length - 1)
		}
	}, [requests.length])

	const handlePrevMonth = () => {
		setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : prev))
	}

	const handleNextMonth = () => {
		setCurrentMonthIndex(prev => (prev < requests.length - 1 ? prev + 1 : prev))
	}

	const currentRequest = requests[currentMonthIndex]

	return (
		<div className='bg-white rounded-xl p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.03)]'>
			<div className='flex items-center justify-between mb-4'>
				<div>
					<h3 className='text-lg font-semibold text-gray-900'>Requisições</h3>
					<p className='text-sm text-gray-500'>Requisições por período</p>
				</div>
				<div className='flex items-center space-x-2'>
					<div className='bg-gray-100 rounded p-1'>
						<button
							className='p-1 text-gray-400 hover:text-gray-600'
							onClick={handlePrevMonth}
							type='button'
						>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<title>Left</title>
								<path
									d='M15 19l-7-7 7-7'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						</button>
					</div>
					<div className='bg-gray-100 rounded p-1'>
						<button
							className='p-1 text-gray-400 hover:text-gray-600'
							onClick={handleNextMonth}
							type='button'
						>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<title>Right</title>
								<path
									d='M9 5l7 7-7 7'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
			{currentRequest && (
				<div className='mb-4'>
					<div className='text-base font-semibold text-gray-800 mb-1'>
						{currentMonthIndex === requests.length - 1
							? 'Novas neste mês'
							: `Novas em ${currentRequest.month}`}
					</div>
					<div className='flex items-center space-x-2'>
						<span className='text-4xl font-bold text-gray-800'>
							{currentRequest.new}
						</span>
						<div className='flex-1 bg-gray-200 rounded-full h-2'>
							<div
								className='h-2 rounded-full bg-teal-500'
								style={{
									width: `${currentRequest.percentage}%`
								}}
							/>
						</div>
						<span className='text-sm font-medium text-gray-500'>
							{`${Math.round(currentRequest.percentage)}%`}
						</span>
					</div>
				</div>
			)}
			<div className='h-64'>
				<ResponsiveContainer height='100%' width='100%'>
					<AreaChart data={requests}>
						<defs>
							<linearGradient id={id} x1='0' x2='0' y1='0' y2='1'>
								<stop offset='5%' stopColor='#F43F5E' stopOpacity={0.8} />
								<stop offset='95%' stopColor='#F43F5E' stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis
							axisLine={false}
							dataKey='month'
							tick={{fontSize: 12, fill: '#6B7280'}}
							tickLine={false}
						/>
						<CartesianGrid strokeDasharray='3 3' vertical={false} />
						<YAxis
							axisLine={false}
							domain={[10, 24]}
							tick={{fontSize: 12, fill: '#6B7280'}}
							tickLine={false}
						/>
						<Tooltip />
						<Area
							dataKey='value'
							dot={{fill: '#F43F5E', strokeWidth: 2, r: 4}}
							fill={`url(#${id})`}
							stroke='#F43F5E'
							strokeWidth={2}
							type='monotone'
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
