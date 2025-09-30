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
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '../../../../shared/ui/primitives/Card'
import {getRequests, type RequestData} from '../../api'

const CARD_TITLE = 'Requisições'
const CARD_DESCRIPTION = 'Requisições por período'
const TITLE_NEW_THIS_MONTH = 'Novas neste mês'
const TITLE_NEW_IN = 'Novas em'
const LABEL_PREV_MONTH = 'Mês anterior'
const LABEL_NEXT_MONTH = 'Próximo mês'
const SVG_TITLE_PREV = 'Anterior'
const SVG_TITLE_NEXT = 'Próximo'

function useRequestsData() {
	const {data: requests = []} = useQuery<RequestData[]>({
		queryKey: ['requests'],
		queryFn: getRequests
	})
	const [currentMonthIndex, setCurrentMonthIndex] = useState(0)

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

	return {requests, currentMonthIndex, handlePrevMonth, handleNextMonth}
}

function RequestsChart({
	requests,
	gradientId
}: {
	requests: RequestData[]
	gradientId: string
}) {
	return (
		<ResponsiveContainer height='100%' width='100%'>
			<AreaChart data={requests}>
				<defs>
					<linearGradient id={gradientId} x1='0' x2='0' y1='0' y2='1'>
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
					fill={`url(#${gradientId})`}
					stroke='#F43F5E'
					strokeWidth={2}
					type='monotone'
				/>
			</AreaChart>
		</ResponsiveContainer>
	)
}

export function RequestsCard() {
	const {requests, currentMonthIndex, handlePrevMonth, handleNextMonth} =
		useRequestsData()
	const id = useId()
	const currentRequest = requests[currentMonthIndex]

	return (
		<Card>
			<CardHeader className='mb-4 flex items-center justify-between'>
				<div>
					<CardTitle>{CARD_TITLE}</CardTitle>
					<p className='text-gray-500 text-sm'>{CARD_DESCRIPTION}</p>
				</div>
				<div className='flex items-center space-x-2'>
					<div className='rounded bg-gray-100 p-1'>
						<button
							aria-label={LABEL_PREV_MONTH}
							className='p-1 text-gray-400 hover:text-gray-600'
							onClick={handlePrevMonth}
							type='button'
						>
							<svg
								className='h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<title>{SVG_TITLE_PREV}</title>
								<path
									d='M15 19l-7-7 7-7'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						</button>
					</div>
					<div className='rounded bg-gray-100 p-1'>
						<button
							aria-label={LABEL_NEXT_MONTH}
							className='p-1 text-gray-400 hover:text-gray-600'
							onClick={handleNextMonth}
							type='button'
						>
							<svg
								className='h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<title>{SVG_TITLE_NEXT}</title>
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
			</CardHeader>
			{currentRequest && (
				<div className='mb-4'>
					<div className='mb-1 font-semibold text-base text-gray-800'>
						{currentMonthIndex === requests.length - 1
							? TITLE_NEW_THIS_MONTH
							: `${TITLE_NEW_IN} ${currentRequest.month}`}
					</div>
					<div className='flex items-center space-x-2'>
						<span className='font-bold text-4xl text-gray-800'>
							{currentRequest.new}
						</span>
						<div className='h-2 flex-1 rounded-full bg-gray-200'>
							<div
								className='h-2 rounded-full bg-teal-500'
								style={{width: `${currentRequest.percentage}%`}}
							/>
						</div>
						<span className='font-medium text-gray-500 text-sm'>{`${Math.round(currentRequest.percentage)}%`}</span>
					</div>
				</div>
			)}
			<CardContent className='h-64'>
				<RequestsChart gradientId={id} requests={requests} />
			</CardContent>
		</Card>
	)
}
