import {Link} from 'react-router'

interface BreadcrumbItem {
	label: string
	href?: string
	isActive?: boolean
}

interface BreadcrumbProps {
	items: BreadcrumbItem[]
}

const BREADCRUMB_SEPARATOR = '•'

export function Breadcrumb({items}: BreadcrumbProps) {
	return (
		<nav aria-label='Breadcrumb' className='flex items-center gap-4'>
			{items.map((item, index) => (
				<div className='flex items-center gap-4' key={`${item.label}-${index}`}>
					{item.href && !item.isActive ? (
						<Link
							className='font-normal text-[#212B36] text-sm transition-colors hover:text-[#161C24]'
							to={item.href}
						>
							{item.label}
						</Link>
					) : (
						<span className='font-normal text-[#919EAB] text-sm'>
							{item.label}
						</span>
					)}
					{index < items.length - 1 && (
						<span className='text-[#919EAB]'>{BREADCRUMB_SEPARATOR}</span>
					)}
				</div>
			))}
		</nav>
	)
}
