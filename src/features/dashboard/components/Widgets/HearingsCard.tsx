import {useQuery} from '@tanstack/react-query'
import {DateTime} from 'luxon'
import {useState} from 'react'
import type {DateRange} from 'react-day-picker'
import {DateRangePicker} from '../../../../shared/ui/DateRangePicker'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '../../../../shared/ui/primitives/Card'
import {getHearings, type HearingData} from '../../api'

const CARD_TITLE = 'Audiências e Prazos'
const PERCENT_SYMBOL = '%'
const TOTAL_LABEL = 'Total'
const COMPLETED_LABEL = 'Cumpridos'
const COLON = ':'

export function HearingsCard() {
	const {data: hearings = []} = useQuery<HearingData[]>({
		queryKey: ['hearings'],
		queryFn: getHearings
	})

	const [dateRange, setDateRange] = useState<DateRange | undefined>()
	const [showDatePicker, setShowDatePicker] = useState(false)

	const handleToggleDatePicker = () => {
		setShowDatePicker(!showDatePicker)
	}

	const filteredHearings = hearings.filter(hearing => {
		if (!dateRange?.from) {
			return true
		}
		const from = DateTime.fromJSDate(dateRange.from).startOf('day')
		const to = dateRange.to
			? DateTime.fromJSDate(dateRange.to).endOf('day')
			: from.endOf('day')
		const hearingDate = DateTime.fromISO(hearing.date)

		return hearingDate >= from && hearingDate <= to
	})

	return (
		<Card>
			<CardHeader className='mb-4 flex items-center justify-between'>
				<CardTitle>{CARD_TITLE}</CardTitle>
				<div className='cursor-pointer'>
					<DateRangePicker
						dateRange={dateRange}
						isOpen={showDatePicker}
						onDateRangeChange={setDateRange}
						onToggle={handleToggleDatePicker}
					/>
				</div>
			</CardHeader>
			<CardContent className='space-y-6'>
				{filteredHearings.map(item => (
					<div className='flex items-center' key={item.label}>
						<div className='w-1/4 pr-4'>
							<div className='font-bold text-3xl text-gray-900'>
								{item.percentage}
								{PERCENT_SYMBOL}
							</div>
							<div className='mt-1 text-gray-500 text-sm'>{item.label}</div>
						</div>
						<div className='w-3/4'>
							<div className='mb-1 flex justify-between text-gray-500 text-sm'>
								<span>
									{TOTAL_LABEL}
									{COLON} {item.total}
								</span>
								<span>
									{COMPLETED_LABEL}
									{COLON} {item.completed}
								</span>
							</div>
							<div className='h-2.5 w-full rounded-full bg-gray-200'>
								<div
									className='h-2.5 rounded-full'
									style={{
										width: `${item.percentage}%`,
										backgroundColor: item.color
									}}
								/>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
