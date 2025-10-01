import {useState} from 'react'
import downIcon from '/icons/down.svg'

const OPEN_PAREN = '('
const CLOSE_PAREN = ')'

interface IconProps {
	className?: string | undefined
	strokeWidth?: number | undefined
}

interface SidebarItemProps {
	icon: string | React.ComponentType<IconProps>
	text: string
	active?: boolean | undefined
	isCollapsed: boolean
	color?: string | undefined
	badge?: number | undefined
	hasSubItems?: boolean | undefined
	isOpen?: boolean | undefined
	asButton?: boolean | undefined
	textOffset?: string | undefined
}

const getIconClasses = (isCollapsed: boolean, active = false) => {
	if (active && !isCollapsed) {
		return 'w-6 h-6 brightness-0 invert'
	}
	if (active && isCollapsed) {
		return 'w-6 h-6 filter-orange'
	}
	return 'w-6 h-6'
}

const renderIcon = (props: SidebarItemProps) => {
	// Only render color dot if there's text to go with it
	if (props.color && props.text) {
		return (
			<span
				className='h-2.5 w-2.5 rounded-full'
				style={{backgroundColor: props.color}}
			/>
		)
	}

	// Only render icon if there's one provided
	if (props.icon) {
		// Check if icon is a React component (lucide-react)
		if (typeof props.icon === 'function') {
			const IconComponent = props.icon
			let iconClassName = 'w-6 h-6 text-gray-300 group-hover:text-white'

			if (props.active && !props.isCollapsed) {
				iconClassName = 'w-6 h-6 text-white'
			} else if (props.active && props.isCollapsed) {
				iconClassName = 'w-6 h-6 text-orange-500'
			}

			return <IconComponent className={iconClassName} strokeWidth={2} />
		}

		// Otherwise it's a string path to SVG
		return (
			<img
				alt={props.text}
				className={getIconClasses(props.isCollapsed, props.active)}
				height={24}
				src={props.icon}
				width={24}
			/>
		)
	}

	return null
}

const SidebarItem = (props: SidebarItemProps) => {
	const [showTooltip, setShowTooltip] = useState(false)

	// Don't render if there's no text
	if (!props.text) {
		return null
	}

	let activeClasses = 'text-white hover:bg-gray-700'
	if (props.active && !props.isCollapsed) {
		activeClasses = 'bg-orange-500 text-white'
	}

	const className = `
    relative flex items-center py-[14px] px-3 gap-3
    font-semibold rounded-[10px] cursor-pointer
    transition-colors group text-base w-full
    ${props.isCollapsed ? 'justify-center' : ''}
    ${activeClasses}
`

	const content = (
		<>
			{renderIcon(props)}
			<span
				className={`overflow-hidden text-ellipsis whitespace-nowrap transition-all ${props.isCollapsed ? 'w-0' : 'w-52'} ${props.textOffset || ''}`}
			>
				{props.text}
			</span>
			{props.hasSubItems && !props.isCollapsed && (
				<img
					alt='Dropdown'
					className={`ml-auto h-5 w-5 transition-transform ${props.isOpen ? 'rotate-180' : ''}`}
					height={20}
					src={downIcon || '/placeholder.svg'}
					width={20}
				/>
			)}
			{!props.isCollapsed && props.badge && (
				<div className='ml-auto rounded-md bg-[#BABBC1] px-2 py-1.5 font-semibold text-[#1E293B] text-xs'>
					{props.badge}
				</div>
			)}
			{/* Tooltip */}
			{showTooltip && props.isCollapsed && (
				<div className='absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white'>
					{props.text}
					{props.badge && (
						<span className='ml-2'>
							{OPEN_PAREN}
							{props.badge}
							{CLOSE_PAREN}
						</span>
					)}
				</div>
			)}
		</>
	)

	return (
		<>
			<style>
				{`
      .filter-orange {
        filter: brightness(0) saturate(100%) invert(69%) sepia(70%) saturate(1364%) hue-rotate(346deg) brightness(100%) contrast(97%);
      }
    `}
			</style>
			{props.asButton !== false ? (
				<button
					aria-label={props.isCollapsed ? props.text : undefined}
					className={className}
					data-testid={`sidebar-${props.text.toLowerCase().replace(/\s+/g, '-')}`}
					onMouseEnter={() => props.isCollapsed && setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
					type='button'
				>
					{content}
				</button>
			) : (
				<div className={className}>{content}</div>
			)}
		</>
	)
}

export {SidebarItem}
