import {Calendar, ChevronDown} from 'lucide-react'
import type {FolderDetail} from '../types/folder.types'

const SelectInput = (props: {
	label: string
	options: string[]
	defaultValue?: string
	value?: string
}) => (
	<div className='flex flex-col gap-1'>
		<label className='text-sm font-medium text-gray-700' htmlFor={props.label}>
			{props.label}
		</label>
		<div className='relative'>
			<select
				className='w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500'
				defaultValue={props.defaultValue}
				id={props.label}
				readOnly={true}
				value={props.value}
			>
				{props.options.map(option => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
			<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
		</div>
	</div>
)

const TextInput = (props: {
	label: string
	placeholder?: string
	value?: string
}) => (
	<div className='flex flex-col gap-1'>
		<label className='text-sm font-medium text-gray-700' htmlFor={props.label}>
			{props.label}
		</label>
		<input
			className='w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500'
			id={props.label}
			placeholder={props.placeholder}
			readOnly={true}
			type='text'
			value={props.value}
		/>
	</div>
)

const DateInput = (props: {label: string; value?: string}) => (
	<div className='flex flex-col gap-1'>
		<label className='text-sm font-medium text-gray-700' htmlFor={props.label}>
			{props.label}
		</label>
		<div className='relative'>
			<input
				className='w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500'
				id={props.label}
				readOnly={true}
				type='text'
				value={props.value}
			/>
			<Calendar className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
		</div>
	</div>
)

const TextareaInput = (props: {label: string; value?: string}) => (
	<div className='flex flex-col gap-1'>
		<label className='text-sm font-medium text-gray-700' htmlFor={props.label}>
			{props.label}
		</label>
		<textarea
			className='w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 h-24 resize-none'
			id={props.label}
			placeholder='Digite aqui...'
			value={props.value}
		/>
	</div>
)

const ToggleSwitch = (props: {label: string; checked?: boolean}) => (
	<div className='flex items-center gap-2'>
		<button
			aria-pressed={props.checked}
			className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
				props.checked ? 'bg-cyan-600' : 'bg-gray-200'
			}`}
			type='button'
		>
			<span
				aria-hidden='true'
				className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
					props.checked ? 'translate-x-5' : 'translate-x-0'
				}`}
			/>
		</button>
		<span className='text-sm text-gray-700'>{props.label}</span>
	</div>
)

export function FolderDetailForm({folder}: {folder: FolderDetail}) {
	return (
		<div className='bg-white rounded-lg p-6 shadow-sm'>
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6 border-b pb-6 mb-6'>
				<TextInput label='Nº Processo' value={folder.processNumber} />
				<TextInput label='Nº CNJ' value={folder.cnjNumber} />
				<SelectInput
					label='Instância'
					options={['Primeira Instância', 'Segunda Instância']}
					value={folder.instance}
				/>
				<SelectInput
					label='Natureza'
					options={['Cível']}
					value={folder.nature}
				/>
				<SelectInput
					label='Tipo de Ação'
					options={['Ordinária']}
					value={folder.actionType}
				/>
				<SelectInput
					label='Fase'
					options={['Conhecimento']}
					value={folder.phase}
				/>
				<SelectInput
					label='Eletrônico'
					options={['Sim', 'Não']}
					value={folder.electronic}
				/>
				<SelectInput
					label='Cód. Cliente'
					options={['001', '002']}
					value={folder.clientCode}
				/>
				<TextInput label='Pasta' value={folder.folder} />
				<SelectInput
					label='Caso Padrão Faturamento'
					options={['Sim', 'Não']}
					value={folder.defaultBillingCase}
				/>
				<div className='flex items-end'>
					<ToggleSwitch checked={folder.totus} label='TOTUS' />
				</div>
				<div className='flex items-end'>
					<ToggleSwitch checked={folder.migrated} label='Migrado' />
				</div>
				<SelectInput label='Órgão' options={['TJSP']} value={folder.organ} />
				<SelectInput
					label='Distribuição'
					options={['Sorteio']}
					value={folder.distribution}
				/>
				<DateInput label='Entrada' value={folder.entryDate} />
				<SelectInput label='Status' options={['Ativo']} value={folder.status} />
				<TextInput label='Código Interno' value={folder.internalCode} />
				<SelectInput
					label='Tipo de Pesquisa'
					options={['Padrão']}
					value={folder.searchType}
				/>
				<TextInput label='Código' value={folder.code} />
				<TextInput label='Juiz' value={folder.judge} />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6 mb-6'>
				<SelectInput
					label='Área'
					options={['Cível Contencioso']}
					value={folder.area}
				/>
				<SelectInput
					label='Comarca'
					options={['São Paulo']}
					value={folder.district}
				/>
				<SelectInput
					label='Sócio'
					options={['Dr. João']}
					value={folder.partner}
				/>
				<SelectInput
					label='SubÁrea'
					options={['Contratos']}
					value={folder.subArea}
				/>
				<SelectInput
					label='Foro'
					options={['Foro Central Cível']}
					value={folder.court}
				/>
				<SelectInput
					label='Coordenador'
					options={['Dra. Maria']}
					value={folder.coordinator}
				/>
				<SelectInput
					label='Núcleo'
					options={['Equipe 1']}
					value={folder.core}
				/>
				<SelectInput
					label='Vara'
					options={['1ª Vara Cível']}
					value={folder.courtDivision}
				/>
				<SelectInput
					label='Advogado'
					options={['Dr. Carlos']}
					value={folder.lawyer}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
				<div className='flex gap-4'>
					<ToggleSwitch label='Polo Ativo' />
					<ToggleSwitch label='Polo Passivo' />
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<TextareaInput label='Observação' value={folder.observation} />
				<TextareaInput
					label='Detalhamento do Objeto'
					value={folder.objectDetail}
				/>
				<TextareaInput label='Último Andamento' value={folder.lastMovement} />
			</div>
		</div>
	)
}
