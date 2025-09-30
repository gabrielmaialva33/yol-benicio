import {useQuery} from '@tanstack/react-query'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '../../../../shared/ui/primitives/Card'
import {type BirthdayData, getBirthdays} from '../../api'

const CARD_TITLE = 'Aniversariantes'
const VIEW_ALL_TEXT = 'Ver todos'
const DESCRIPTION_TEXT = 'Colegas que fazem aniversário este mês'
const GO_ICON_TITLE = 'Go'
const PLACEHOLDER_IMAGE = '/placeholder.svg'

export function BirthdaysCard() {
	const {data: birthdays = []} = useQuery<BirthdayData[]>({
		queryKey: ['birthdays'],
		queryFn: getBirthdays
	})

	return (
		<Card>
			<CardHeader className='mb-4 flex items-center justify-between'>
				<CardTitle>{CARD_TITLE}</CardTitle>
				<button
					className='cursor-pointer font-medium text-cyan-500 text-sm hover:text-cyan-600'
					type='button'
				>
					{VIEW_ALL_TEXT}
				</button>
			</CardHeader>
			<p className='mb-4 text-gray-500 text-sm'>{DESCRIPTION_TEXT}</p>
			<CardContent className='space-y-4'>
				{birthdays.slice(0, 2).map(user => (
					<div className='flex items-center space-x-3' key={user.email}>
						<img
							alt={user.name}
							className='h-10 w-10 rounded-full'
							height={40}
							src={user.avatar || PLACEHOLDER_IMAGE}
							width={40}
						/>
						<div className='flex-1'>
							<div className='font-medium text-gray-900'>{user.name}</div>
							<div className='text-gray-500 text-sm'>{user.email}</div>
						</div>
						<button
							className='cursor-pointer p-1 text-gray-400 hover:text-gray-600'
							type='button'
						>
							<svg
								className='h-5 w-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<title>{GO_ICON_TITLE}</title>
								<path
									d='M9 5l7 7-7 7'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						</button>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
