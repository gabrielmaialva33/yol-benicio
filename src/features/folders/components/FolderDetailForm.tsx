import {Calendar, ChevronDown} from 'lucide-react'
import type {FolderDetail} from '../types/folder.types'

const SelectInput = (props: {
	label: string
	options: string[]
	defaultValue?: string
	value?: string
}) => (
	<div className='flex flex-col gap-1'>
		<label className='font-medium text-gray-700 text-sm' htmlFor={props.label}>
			{props.label}
		</label>
		<div className='relative'>
			<select
				className='w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500'
				defaultValue={props.defaultValue}
				disabled={true}
				id={props.label}
				value={props.value}
			>
				{props.options.map(option => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
			<ChevronDown className='-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-gray-400' />
		</div>
	</div>
)

const TextInput = (props: {
	label: string
	placeholder?: string
	value?: string
}) => (
	<div className='flex flex-col gap-1'>
		<label className='font-medium text-gray-700 text-sm' htmlFor={props.label}>
			{props.label}
		</label>
		<input
			className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500'
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
		<label className='font-medium text-gray-700 text-sm' htmlFor={props.label}>
			{props.label}
		</label>
		<div className='relative'>
			<input
				className='w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500'
				id={props.label}
				readOnly={true}
				type='text'
				value={props.value}
			/>
			<Calendar className='-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-gray-400' />
		</div>
	</div>
)

const TextareaInput = (props: {label: string; value?: string}) => (
	<div className='flex flex-col gap-1'>
		<label className='font-medium text-gray-700 text-sm' htmlFor={props.label}>
			{props.label}
		</label>
		<textarea
			className='h-24 w-full resize-none rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500'
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
		<span className='text-gray-700 text-sm'>{props.label}</span>
	</div>
)

const ProcessInfoSection = (props: {folder: FolderDetail}) => (
	<div className='mb-6 grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-4'>
		<TextInput label='Nº Processo' value={props.folder.processNumber} />
		<TextInput label='Nº CNJ' value={props.folder.cnjNumber} />
		<SelectInput
			label='Instância'
			options={['Primeira Instância', 'Segunda Instância']}
			value={props.folder.instance}
		/>
		<SelectInput
			label='Natureza'
			options={['Cível']}
			value={props.folder.nature}
		/>
		<SelectInput
			label='Tipo de Ação'
			options={['Ordinária']}
			value={props.folder.actionType}
		/>
		<SelectInput
			label='Fase'
			options={['Conhecimento']}
			value={props.folder.phase}
		/>
		<SelectInput
			label='Eletrônico'
			options={['Sim', 'Não']}
			value={props.folder.electronic}
		/>
		<SelectInput
			label='Cód. Cliente'
			options={['001', '002']}
			value={props.folder.clientCode}
		/>
		<TextInput label='Pasta' value={props.folder.folder} />
		<SelectInput
			label='Caso Padrão Faturamento'
			options={['Sim', 'Não']}
			value={props.folder.defaultBillingCase}
		/>
		<div className='flex items-end'>
			<ToggleSwitch checked={props.folder.totus} label='TOTUS' />
		</div>
		<div className='flex items-end'>
			<ToggleSwitch checked={props.folder.migrated} label='Migrado' />
		</div>
		<SelectInput label='Órgão' options={['TJSP']} value={props.folder.organ} />
		<SelectInput
			label='Distribuição'
			options={['Sorteio']}
			value={props.folder.distribution}
		/>
		<DateInput label='Entrada' value={props.folder.entryDate} />
		<SelectInput
			label='Status'
			options={['Ativo']}
			value={props.folder.status}
		/>
		<TextInput label='Código Interno' value={props.folder.internalCode} />
		<SelectInput
			label='Tipo de Pesquisa'
			options={['Padrão']}
			value={props.folder.searchType}
		/>
		<TextInput label='Código' value={props.folder.code} />
		<TextInput label='Juiz' value={props.folder.judge} />
	</div>
)

const OrganizationSection = (props: {folder: FolderDetail}) => (
	<div className='mb-6 grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-3'>
		<SelectInput
			label='Área'
			options={['Cível Contencioso']}
			value={props.folder.area}
		/>
		<SelectInput
			label='Comarca'
			options={['São Paulo']}
			value={props.folder.district}
		/>
		<SelectInput
			label='Sócio'
			options={['Dr. João']}
			value={props.folder.partner}
		/>
		<SelectInput
			label='SubÁrea'
			options={['Contratos']}
			value={props.folder.subArea}
		/>
		<SelectInput
			label='Foro'
			options={['Foro Central Cível']}
			value={props.folder.court}
		/>
		<SelectInput
			label='Coordenador'
			options={['Dra. Maria']}
			value={props.folder.coordinator}
		/>
		<SelectInput
			label='Núcleo'
			options={['Equipe 1']}
			value={props.folder.core}
		/>
		<SelectInput
			label='Vara'
			options={['1ª Vara Cível']}
			value={props.folder.courtDivision}
		/>
		<SelectInput
			label='Advogado'
			options={['Dr. Carlos']}
			value={props.folder.lawyer}
		/>
	</div>
)

const PoleSection = () => (
	<div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
		<div className='flex gap-4'>
			<ToggleSwitch label='Polo Ativo' />
			<ToggleSwitch label='Polo Passivo' />
		</div>
	</div>
)

const NotesSection = (props: {folder: FolderDetail}) => (
	<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
		<TextareaInput label='Observação' value={props.folder.observation} />
		<TextareaInput
			label='Detalhamento do Objeto'
			value={props.folder.objectDetail}
		/>
		<TextareaInput label='Último Andamento' value={props.folder.lastMovement} />
	</div>
)

export function FolderDetailForm(props: {folder: FolderDetail}) {
	return (
		<div className='rounded-lg bg-white p-6 shadow-sm'>
			<ProcessInfoSection folder={props.folder} />
			<OrganizationSection folder={props.folder} />
			<PoleSection />
			<NotesSection folder={props.folder} />
		</div>
	)
}
