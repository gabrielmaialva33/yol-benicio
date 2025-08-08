'use client'

import {useQuery} from '@tanstack/react-query'
import {useState} from 'react'
import {Link, useLocation} from 'react-router'
import downIcon from '/icons/down.svg'
import foldersIcon from '/icons/folders.svg'
import leftSquareIcon from '/icons/left-square.svg'
import logoCollapsed from '/icons/logo.svg'
import magnifierIcon from '/icons/magnifier.svg'
import overviewIcon from '/icons/overview.svg'
import logoExpanded from '/logo-yol.svg'
import {SidebarItem} from './SidebarItem'

interface SubMenuItem {
	text: string
	path: string
}

interface MenuItem {
	icon: string
	text: string
	path?: string
	active?: boolean
	color?: string
	badge?: number
	subItems?: SubMenuItem[]
}

interface FavoriteClient {
	id: number
	name: string
	folderCount: number
	color: string
}

async function getFavoriteClients(): Promise<FavoriteClient[]> {
	const response = await fetch('/api/dashboard/favorite-clients')
	return response.json()
}

const pages: MenuItem[] = [
	{
		icon: overviewIcon,
		text: 'Visão Geral',
		path: '/dashboard'
	},
	{
		icon: foldersIcon,
		text: 'Pastas',
		path: '/dashboard/folders',
		subItems: [
			{text: 'Cadastrar', path: '/dashboard/folders/register'},
			{text: 'Consulta', path: '/dashboard/folders/consultation'}
		]
	}
]

const DROPDOWN_VISIBLE_ITEMS_LIMIT = 3
const MOBILE_BREAKPOINT = 768

const SidebarHeader = (props: {isCollapsed: boolean; toggle: () => void}) => (
	<div
		className={`flex items-center ${props.isCollapsed ? 'justify-center' : 'justify-between px-4'}`}
	>
		<img
			alt='Logo'
			className={`cursor-pointer duration-500 ${props.isCollapsed ? 'w-10' : 'w-[159px]'}`}
			src={props.isCollapsed ? logoCollapsed : logoExpanded}
		/>
		{!props.isCollapsed && (
			<button onClick={props.toggle} type='button'>
				<img
					alt='Alternar Barra Lateral'
					className='transition-transform duration-300'
					src={leftSquareIcon || '/placeholder.svg'}
				/>
			</button>
		)}
	</div>
)

const SearchInput = (props: {isCollapsed: boolean}) =>
	props.isCollapsed ? null : (
		<div className='flex items-center rounded-md bg-[#475569] mt-6 px-4 py-2'>
			<img
				alt='Pesquisar'
				className='w-4 h-4 text-white'
				src={magnifierIcon || '/placeholder.svg'}
			/>
			<input
				className='text-sm bg-transparent w-full text-white focus:outline-none ml-2 placeholder:text-white'
				placeholder='Pesquisar'
				type='search'
			/>
		</div>
	)

const MenuItemComponent = (props: {
	item: MenuItem
	isCollapsed: boolean
	openDropdown: string
	handleDropdown: (text: string) => void
	location: ReturnType<typeof useLocation>
}) => {
	const isActive = props.location.pathname === props.item.path
	const isDropdownOpen =
		props.openDropdown === props.item.text ||
		props.location.pathname.startsWith(props.item.path || '---')

	const content = (
		<SidebarItem
			active={isActive}
			asButton={!props.item.subItems}
			badge={props.item.badge}
			color={props.item.color}
			hasSubItems={Boolean(props.item.subItems)}
			icon={props.item.icon}
			isCollapsed={props.isCollapsed}
			isOpen={isDropdownOpen}
			text={props.item.text}
		/>
	)

	return (
		<div key={props.item.text}>
			{props.item.subItems ? (
				<button
					className='w-full'
					data-testid={`sidebar-${props.item.text.toLowerCase().replace(/\s+/g, '-')}`}
					onClick={() => props.handleDropdown(props.item.text)}
					type='button'
				>
					{content}
				</button>
			) : (
				<Link to={props.item.path || '#'}>{content}</Link>
			)}
			{props.item.subItems && isDropdownOpen && !props.isCollapsed && (
				<ul className='pl-8 mt-2 space-y-2'>
					{props.item.subItems.map(subItem => {
						const isSubItemActive = props.location.pathname === subItem.path
						return (
							<li key={subItem.text}>
								<Link
									className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors ${
										isSubItemActive
											? 'bg-orange-500 text-white'
											: 'text-gray-400 hover:text-white hover:bg-gray-700'
									}`}
									to={subItem.path}
								>
									<span className='w-1.5 h-1.5 bg-white rounded-full mr-3' />
									{subItem.text}
								</Link>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}

const MenuList = (props: {
	title: string
	items: MenuItem[]
	isCollapsed: boolean
	isDropdown?: boolean
}) => {
	const location = useLocation()
	const [openDropdown, setOpenDropdown] = useState(
		props.items.find(item => location.pathname.startsWith(item.path || '---'))
			?.text || ''
	)
	const [showAll, setShowAll] = useState(false)

	const handleDropdown = (text: string) => {
		setOpenDropdown(openDropdown === text ? '' : text)
	}

	let visibleItems = props.items
	if (props.isDropdown && !showAll && !props.isCollapsed) {
		visibleItems = props.items.slice(0, DROPDOWN_VISIBLE_ITEMS_LIMIT)
	}

	return (
		<ul className='pt-2'>
			<p
				className={`text-sm font-semibold text-[#A1A5B7] mt-4 mb-2 ${props.isCollapsed ? 'hidden' : 'block'}`}
			>
				{props.title}
			</p>
			{visibleItems.map(item => (
				<MenuItemComponent
					handleDropdown={handleDropdown}
					isCollapsed={props.isCollapsed}
					item={item}
					key={item.text}
					location={location}
					openDropdown={openDropdown}
				/>
			))}
			{props.isDropdown &&
				!props.isCollapsed &&
				props.items.length > DROPDOWN_VISIBLE_ITEMS_LIMIT && (
					<button
						className='flex items-center pl-3 mt-2 cursor-pointer'
						onClick={() => setShowAll(!showAll)}
						type='button'
					>
						<img
							alt='Mostrar mais'
							className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
							src={downIcon || '/placeholder.svg'}
						/>
						<span className='ml-2 text-sm text-[#A1A5B7] font-semibold'>
							{showAll ? 'Mostrar menos' : 'Mostrar mais'}
						</span>
					</button>
				)}
		</ul>
	)
}

const Sidebar = () => {
	// On mobile (screen width < 768px), default to collapsed
	const [isCollapsed, setIsCollapsed] = useState(
		typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
	)
	const {data: favoriteClients = []} = useQuery<FavoriteClient[]>({
		queryKey: ['favorite-clients'],
		queryFn: getFavoriteClients
	})

	const toggleSidebar = () => setIsCollapsed(!isCollapsed)

	// Convert favorite clients to MenuItem format
	const favorites: MenuItem[] = favoriteClients.map(client => ({
		icon: '',
		color: client.color,
		text: client.name,
		badge: client.folderCount,
		path: `/dashboard/folders/consultation?clientId=${client.id}`
	}))

	return (
		<aside
			className={`bg-[#1F2A37] text-white ${
				isCollapsed ? 'w-16 md:w-24 items-center' : 'w-[280px] md:w-[340px]'
			} py-10 transition-all duration-300 ease-in-out flex flex-col gap-y-6`}
		>
			<SidebarHeader isCollapsed={isCollapsed} toggle={toggleSidebar} />
			{isCollapsed && (
				<button
					className='bg-[#1F2A37] text-white rounded-full p-1'
					onClick={toggleSidebar}
					type='button'
				>
					<img
						alt='Alternar Sidebar'
						className='transition-transform duration-300 rotate-180'
						src={leftSquareIcon || '/placeholder.svg'}
					/>
				</button>
			)}
			<nav className='w-full'>
				<div className={`${isCollapsed ? '' : 'px-10'}`}>
					<SearchInput isCollapsed={isCollapsed} />
				</div>
				<div
					className={`${isCollapsed ? 'flex flex-col items-center' : 'px-10'}`}
				>
					<MenuList isCollapsed={isCollapsed} items={pages} title='PÁGINAS' />
				</div>
				{!isCollapsed && favorites.length > 0 && (
					<>
						<div className='border-b border-solid border-[#334155] mx-10 my-4' />
						<div className='px-10'>
							<MenuList
								isCollapsed={isCollapsed}
								isDropdown={true}
								items={favorites}
								title='CLIENTES FAVORITOS'
							/>
						</div>
					</>
				)}
			</nav>
		</aside>
	)
}

export {Sidebar}
