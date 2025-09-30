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
				className='h-4 w-4'
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
				className='h-4 w-4'
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
			<CardHeader className='mb-4 flex items-start justify-between'>
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
			<div className='mb-4 font-bold text-[40px] leading-none'>
				{billingData.value}
			</div>
			<CardContent className='-mx-6 -mb-6 h-16'>
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
