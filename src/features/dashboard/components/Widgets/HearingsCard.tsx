import {useQuery} from '@tanstack/react-query'
import {DateTime} from 'luxon'
import {useState} from 'react'
import type {DateRange} from 'react-day-picker'
import {DateRangePicker} from '../../../../shared/ui/DateRangePicker'

interface Hearing {
	label: string
	percentage: number
	total: number
	completed: number
	color: string
	date: string
}

async function getHearings(): Promise<Hearing[]> {
	const response = await fetch('/api/hearings')
	return response.json()
}

export function HearingsCard() {
	const {data: hearings = []} = useQuery<Hearing[]>({
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
		<div className='bg-white rounded-xl p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.03)] relative'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-900'>
					Audiências e Prazos
				</h3>
				<div className='cursor-pointer'>
					<DateRangePicker
						dateRange={dateRange}
						isOpen={showDatePicker}
						onDateRangeChange={setDateRange}
						onToggle={handleToggleDatePicker}
					/>
				</div>
			</div>
			<div className='space-y-6'>
				{filteredHearings.map(item => (
					<div className='flex items-center' key={item.label}>
						<div className='w-1/4 pr-4'>
							<div className='text-3xl font-bold text-gray-900'>
								{item.percentage}%
							</div>
							<div className='text-sm text-gray-500 mt-1'>{item.label}</div>
						</div>
						<div className='w-3/4'>
							<div className='flex justify-between text-sm text-gray-500 mb-1'>
								<span>Total: {item.total}</span>
								<span>Cumpridos: {item.completed}</span>
							</div>
							<div className='w-full bg-gray-200 rounded-full h-2.5'>
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
			</div>
		</div>
	)
}
