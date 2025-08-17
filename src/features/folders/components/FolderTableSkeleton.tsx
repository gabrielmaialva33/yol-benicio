import {Skeleton} from '@shared/components/LoadingSkeleton'

export function FolderTableSkeleton() {
	return (
		<div className='bg-white'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={20} />
						</th>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={100} />
						</th>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={80} />
						</th>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={120} />
						</th>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={100} />
						</th>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={80} />
						</th>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={100} />
						</th>
						<th className='px-6 py-3 text-left'>
							<Skeleton height={16} variant='text' width={40} />
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{Array.from({length: 10}, (_, index) => index).map(index => (
						<tr key={`skeleton-row-${index}`}>
							<td className='px-6 py-4'>
								<Skeleton height={16} variant='rectangular' width={20} />
							</td>
							<td className='px-6 py-4'>
								<div className='space-y-2'>
									<Skeleton height={16} variant='text' width='60%' />
									<Skeleton height={14} variant='text' width='40%' />
								</div>
							</td>
							<td className='px-6 py-4'>
								<Skeleton height={24} variant='rounded' width={80} />
							</td>
							<td className='px-6 py-4'>
								<div className='space-y-1'>
									<Skeleton height={16} variant='text' width='80%' />
									<Skeleton height={14} variant='text' width='60%' />
								</div>
							</td>
							<td className='px-6 py-4'>
								<Skeleton height={16} variant='text' width='70%' />
							</td>
							<td className='px-6 py-4'>
								<Skeleton height={16} variant='text' width='60%' />
							</td>
							<td className='px-6 py-4'>
								<Skeleton height={16} variant='text' width='50%' />
							</td>
							<td className='px-6 py-4'>
								<Skeleton height={20} variant='circular' width={20} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
