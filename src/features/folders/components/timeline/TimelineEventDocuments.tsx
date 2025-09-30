import {Download, Eye, FileText} from 'lucide-react'

interface Document {
	id: string
	name: string
	type: 'pdf' | 'doc' | 'image'
	size: string
}

interface TimelineEventDocumentsProps {
	documents?: Document[]
}

export function TimelineEventDocuments({
	documents
}: TimelineEventDocumentsProps) {
	if (!documents || documents.length === 0) {
		return null
	}

	return (
		<div className='mt-3 space-y-2'>
			{documents.map(doc => (
				<div
					className='flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:shadow-sm transition-all'
					key={doc.id}
				>
					<div className='flex items-center gap-3'>
						<div className='flex h-10 w-10 items-center justify-center'>
							{doc.type === 'pdf' ? (
								<div className='relative h-8 w-6'>
									<div className='absolute inset-0 rounded bg-red-500' />
									<div className='absolute inset-x-1 bottom-1 flex items-center justify-center'>
										<span className='text-[8px] font-bold text-white'>
											{/* PDF */}
										</span>
									</div>
								</div>
							) : (
								<FileText className='h-6 w-6 text-blue-500' />
							)}
						</div>
						<div>
							<p className='text-sm font-medium text-gray-900'>{doc.name}</p>
							<p className='text-xs text-gray-500'>{doc.size}</p>
						</div>
					</div>
					<div className='flex gap-2'>
						<button className='rounded p-1.5 hover:bg-gray-100' type='button'>
							<Eye className='h-4 w-4 text-gray-500' />
						</button>
						<button className='rounded p-1.5 hover:bg-gray-100' type='button'>
							<Download className='h-4 w-4 text-gray-500' />
						</button>
					</div>
				</div>
			))}
		</div>
	)
}
