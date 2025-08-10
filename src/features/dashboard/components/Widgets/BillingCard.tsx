import {Line, LineChart, ResponsiveContainer} from 'recharts'
import {billingData} from '../../../../mocks/data/billing'

export function BillingCard() {
	const percentageColor =
		billingData.percentage > 0 ? 'text-green-500' : 'text-red-500'
	const percentageIcon =
		billingData.percentage > 0 ? (
			<svg
				className='w-4 h-4'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<title>Up</title>
				<path
					d='M5 17l5-5 5 5M5 7h10v10'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
				/>
			</svg>
		) : (
			<svg
				className='w-4 h-4'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<title>Down</title>
				<path
					d='M19 7l-10 10-5-5'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
				/>
			</svg>
		)

	return (
		<div className='bg-[#E6F8F3] text-[#004B50] rounded-xl p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.03)]'>
			<div className='flex items-start justify-between mb-4'>
				<h3 className='text-lg font-semibold'>Faturamento</h3>
				<div className='text-right'>
					<div
						className={`flex items-center space-x-1 font-semibold ${percentageColor}`}
					>
						{percentageIcon}
						<span>{`${billingData.percentage.toFixed(2)}%`}</span>
					</div>
					<div className='text-sm'>Último mês</div>
				</div>
			</div>
			<div className='text-4xl font-bold mb-4'>{billingData.value}</div>
			<div className='h-16 -mx-6 -mb-6'>
				<ResponsiveContainer height='100%' width='100%'>
					<LineChart data={billingData.chart}>
						<Line
							dataKey='pv'
							dot={false}
							stroke='#004B50'
							strokeWidth={2}
							type='monotone'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
