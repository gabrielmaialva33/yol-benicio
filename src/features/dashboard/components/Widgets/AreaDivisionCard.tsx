import {useQuery} from '@tanstack/react-query'
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts'

interface AreaDivision {
	name: string
	value: number
	color: string
}

async function getAreaDivision(): Promise<AreaDivision[]> {
	const response = await fetch('/api/area-division')
	return response.json()
}

const DEGREES_IN_HALF_CIRCLE = 180
const LABEL_POSITION_RATIO = 0.5
const OUTER_RADIUS = 60
const MINIMUM_PERCENTAGE_TO_DISPLAY = 2

export function AreaDivisionCard() {
	const {data: areaDivision = []} = useQuery<AreaDivision[]>({
		queryKey: ['areaDivision'],
		queryFn: getAreaDivision
	})

	return (
		<div className='bg-white rounded-xl p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.03)]'>
			<h3 className='text-lg font-semibold text-gray-900 mb-4'>
				Divisão por áreas
			</h3>
			<div className='flex items-center justify-between'>
				<div className='w-40 h-40'>
					<ResponsiveContainer height='100%' width='100%'>
						<PieChart>
							<Pie
								cx='50%'
								cy='50%'
								data={areaDivision}
								dataKey='value'
								innerRadius={0}
								label={({
									cx,
									cy,
									midAngle,
									innerRadius,
									outerRadius,
									value
								}) => {
									if (midAngle === undefined || value === undefined) {
										return null
									}
									if (value < MINIMUM_PERCENTAGE_TO_DISPLAY) {
										return null
									}
									const radian = Math.PI / DEGREES_IN_HALF_CIRCLE
									const radius =
										innerRadius +
										(outerRadius - innerRadius) * LABEL_POSITION_RATIO
									const x = cx + radius * Math.cos(-midAngle * radian)
									const y = cy + radius * Math.sin(-midAngle * radian)
									return (
										<text
											className='text-sm font-semibold'
											dominantBaseline='central'
											fill='white'
											textAnchor='middle'
											x={x}
											y={y}
										>
											{`${value}%`}
										</text>
									)
								}}
								labelLine={false}
								outerRadius={OUTER_RADIUS}
							>
								{areaDivision.map(entry => (
									<Cell fill={entry.color} key={entry.name} stroke='white' />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className='space-y-2'>
					{areaDivision.map(item => (
						<div className='flex items-center space-x-2' key={item.name}>
							<div
								className='w-3 h-3 rounded-full'
								style={{backgroundColor: item.color}}
							/>
							<span className='text-sm text-gray-600'>{item.name}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
