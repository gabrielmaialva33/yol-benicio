import {Line, LineChart, ResponsiveContainer} from 'recharts'
import {billingData} from '../../../../mocks/data/billing'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '../../../../shared/ui/primitives/Card'

const UP_ICON_TITLE = 'Up'
const DOWN_ICON_TITLE = 'Down'
const BILLING_TITLE = 'Faturamento'
const LAST_MONTH_TEXT = 'Último mês'
const PERCENT_SYMBOL = '%'

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
				<title>{UP_ICON_TITLE}</title>
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
				<title>{DOWN_ICON_TITLE}</title>
				<path
					d='M19 7l-10 10-5-5'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
				/>
			</svg>
		)

	return (
		<Card tinted={true}>
			<CardHeader className='flex items-start justify-between mb-4'>
				<CardTitle className='text-[var(--color-text-primary)]'>
					{BILLING_TITLE}
				</CardTitle>
				<div className='text-right'>
					<div
						className={`flex items-center space-x-1 font-semibold ${percentageColor}`}
					>
						{percentageIcon}
						<span>{`${billingData.percentage.toFixed(2)}${PERCENT_SYMBOL}`}</span>
					</div>
					<div className='text-sm'>{LAST_MONTH_TEXT}</div>
				</div>
			</CardHeader>
			<div className='text-[40px] font-bold mb-4 leading-none'>
				{billingData.value}
			</div>
			<CardContent className='h-16 -mx-6 -mb-6'>
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
			</CardContent>
		</Card>
	)
}
