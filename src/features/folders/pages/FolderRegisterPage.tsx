import {Calendar, ChevronDown} from 'lucide-react'
import {useState} from 'react'
import {useNavigate} from 'react-router'

// Constants
const SELECT_PLACEHOLDER = 'Selecione...'
const TEXTAREA_PLACEHOLDER = 'Digite aqui...'
const SECTION_TITLES = {
	BASIC_INFO: 'Informações Básicas',
	COURT_INFO: 'Informações do Tribunal',
	LOCATION_RESPONSIBLE: 'Localização e Responsáveis',
	PROCESS_PARTIES: 'Partes do Processo',
	ACTIVE_PARTY: 'Polo Ativo',
	PASSIVE_PARTY: 'Polo Passivo',
	VALUES: 'Valores',
	DETAILED_INFO: 'Informações Detalhadas'
} as const

const BUTTON_LABELS = {
	CANCEL: 'Cancelar',
	SAVE: 'Salvar Pasta'
} as const

interface FormData {
	// Basic information
	processNumber: string
	cnjNumber: string
	instance: string
	nature: string
	actionType: string
	phase: string
	electronic: string
	clientCode: string
	folder: string
	standardBillingCase: string
	totus: boolean
	migrated: boolean

	// Court information
	organ: string
	distribution: string
	entryDate: string
	status: string
	internalCode: string
	searchType: string
	code: string
	judge: string

	// Location and Responsible parties
	area: string
	subArea: string
	nucleus: string
	district: string
	forum: string
	court: string
	partner: string
	coordinator: string
	lawyer: string

	// Parties
	activePole: {
		name: string
		document: string
		type: string
	}
	passivePole: {
		name: string
		document: string
		type: string
	}

	// Values
	caseValue: string
	costs: string
	fees: string

	// Detailed information
	observation: string
	objectDetails: string
}

const toKebabCase = (str: string) =>
	str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()

const SelectInput = (props: {
	label: string
	options: string[]
	value: string
	onChange: (value: string) => void
}) => {
	const id = toKebabCase(props.label)
	return (
		<div className='flex flex-col gap-2'>
			<label className='font-medium text-[#161C24] text-sm' htmlFor={id}>
				{props.label}
			</label>
			<div className='relative'>
				<select
					className='w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 text-sm transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
					id={id}
					onChange={e => props.onChange(e.target.value)}
					value={props.value}
				>
					<option value=''>{SELECT_PLACEHOLDER}</option>
					{props.options.map(option => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
				<ChevronDown className='-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-4 w-4 text-gray-400' />
			</div>
		</div>
	)
}

const TextInput = (props: {
	label: string
	placeholder?: string
	value: string
	onChange: (value: string) => void
}) => {
	const id = toKebabCase(props.label)
	return (
		<div className='flex flex-col gap-2'>
			<label className='font-medium text-[#161C24] text-sm' htmlFor={id}>
				{props.label}
			</label>
			<input
				className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 text-sm transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
				id={id}
				onChange={e => props.onChange(e.target.value)}
				placeholder={props.placeholder}
				type='text'
				value={props.value}
			/>
		</div>
	)
}

const DateInput = (props: {
	label: string
	value: string
	onChange: (value: string) => void
}) => {
	const id = toKebabCase(props.label)
	return (
		<div className='flex flex-col gap-2'>
			<label className='font-medium text-[#161C24] text-sm' htmlFor={id}>
				{props.label}
			</label>
			<div className='relative'>
				<input
					className='w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-4 text-gray-900 text-sm transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
					id={id}
					onChange={e => props.onChange(e.target.value)}
					type='date'
					value={props.value}
				/>
				<Calendar className='-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-4 w-4 text-gray-400' />
			</div>
		</div>
	)
}

const TextareaInput = (props: {
	label: string
	value: string
	onChange: (value: string) => void
}) => {
	const id = toKebabCase(props.label)
	return (
		<div className='flex flex-col gap-2'>
			<label className='font-medium text-[#161C24] text-sm' htmlFor={id}>
				{props.label}
			</label>
			<textarea
				className='h-24 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 text-sm transition-colors focus:border-[#00B8D9] focus:outline-none focus:ring-2 focus:ring-[#00B8D9]'
				id={id}
				onChange={e => props.onChange(e.target.value)}
				placeholder={TEXTAREA_PLACEHOLDER}
				value={props.value}
			/>
		</div>
	)
}

const ToggleSwitch = (props: {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
}) => (
	<div className='flex items-center gap-3'>
		<button
			aria-pressed={props.checked}
			className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:ring-offset-2 ${
				props.checked ? 'bg-[#00B8D9]' : 'bg-gray-200'
			}`}
			onClick={() => props.onChange(!props.checked)}
			type='button'
		>
			<span
				aria-hidden='true'
				className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
					props.checked ? 'translate-x-5' : 'translate-x-0'
				}`}
			/>
		</button>
		<span className='font-medium text-[#161C24] text-sm'>{props.label}</span>
	</div>
)

export function FolderRegisterPage() {
	const navigate = useNavigate()
	const [formData, setFormData] = useState<FormData>({
		processNumber: '',
		cnjNumber: '',
		instance: '',
		nature: '',
		actionType: '',
		phase: '',
		electronic: 'Sim',
		clientCode: '',
		folder: '',
		standardBillingCase: 'Sim',
		totus: false,
		migrated: false,
		organ: '',
		distribution: '',
		entryDate: '',
		status: 'Ativo',
		internalCode: '',
		searchType: 'Padrão',
		code: '',
		judge: '',
		area: '',
		subArea: '',
		nucleus: '',
		district: '',
		forum: '',
		court: '',
		partner: '',
		coordinator: '',
		lawyer: '',
		activePole: {
			name: '',
			document: '',
			type: 'Autor'
		},
		passivePole: {
			name: '',
			document: '',
			type: 'Réu'
		},
		caseValue: '',
		costs: '',
		fees: '',
		observation: '',
		objectDetails: ''
	})

	const updateField = (
		field: keyof FormData,
		value: string | boolean | {name: string; document: string; type: string}
	) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const updateNestedField = (
		parent: 'activePole' | 'passivePole',
		field: 'name' | 'document' | 'type',
		value: string
	) => {
		setFormData(prev => ({
			...prev,
			[parent]: {
				...prev[parent],
				[field]: value
			}
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Navigate back to consultation page
		void navigate('/dashboard/folders/consultation')
	}

	return (
		<div className='min-h-full bg-[#F1F1F2] p-8'>
			<form onSubmit={handleSubmit}>
				{/* Informações Básicas */}
				<div className='mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
					<h2 className='mb-6 font-semibold text-[#161C24] text-lg'>
						{SECTION_TITLES.BASIC_INFO}
					</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
						<TextInput
							label='Nº Processo'
							onChange={value => updateField('processNumber', value)}
							value={formData.processNumber}
						/>
						<TextInput
							label='Nº CNJ'
							onChange={value => updateField('cnjNumber', value)}
							value={formData.cnjNumber}
						/>
						<SelectInput
							label='Instância'
							onChange={value => updateField('instance', value)}
							options={[
								'Primeira Instância',
								'Segunda Instância',
								'Tribunais Superiores'
							]}
							value={formData.instance}
						/>
						<SelectInput
							label='Natureza'
							onChange={value => updateField('nature', value)}
							options={[
								'Cível',
								'Criminal',
								'Trabalhista',
								'Tributário',
								'Administrativo'
							]}
							value={formData.nature}
						/>
						<TextInput
							label='Tipo de Ação'
							onChange={value => updateField('actionType', value)}
							value={formData.actionType}
						/>
						<SelectInput
							label='Fase'
							onChange={value => updateField('phase', value)}
							options={[
								'Conhecimento',
								'Execução',
								'Recurso',
								'Cumprimento de Sentença'
							]}
							value={formData.phase}
						/>
						<SelectInput
							label='Eletrônico'
							onChange={value => updateField('electronic', value)}
							options={['Sim', 'Não']}
							value={formData.electronic}
						/>
						<TextInput
							label='Código do Cliente'
							onChange={value => updateField('clientCode', value)}
							value={formData.clientCode}
						/>
						<TextInput
							label='Pasta'
							onChange={value => updateField('folder', value)}
							value={formData.folder}
						/>
						<SelectInput
							label='Caso Padrão Faturamento'
							onChange={value => updateField('standardBillingCase', value)}
							options={['Sim', 'Não']}
							value={formData.standardBillingCase}
						/>
						<div className='flex items-end'>
							<ToggleSwitch
								checked={formData.totus}
								label='TOTUS'
								onChange={value => updateField('totus', value)}
							/>
						</div>
						<div className='flex items-end'>
							<ToggleSwitch
								checked={formData.migrated}
								label='Migrado'
								onChange={value => updateField('migrated', value)}
							/>
						</div>
					</div>
				</div>

				{/* Informações do Tribunal */}
				<div className='mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
					<h2 className='mb-6 font-semibold text-[#161C24] text-lg'>
						{SECTION_TITLES.COURT_INFO}
					</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
						<SelectInput
							label='Órgão'
							onChange={value => updateField('organ', value)}
							options={[
								'TJSP',
								'TJRJ',
								'TJMG',
								'TRF-1',
								'TRF-2',
								'TRF-3',
								'TST',
								'STJ',
								'STF'
							]}
							value={formData.organ}
						/>
						<SelectInput
							label='Distribuição'
							onChange={value => updateField('distribution', value)}
							options={['Sorteio', 'Dependência', 'Prevenção']}
							value={formData.distribution}
						/>
						<DateInput
							label='Data de Entrada'
							onChange={value => updateField('entryDate', value)}
							value={formData.entryDate}
						/>
						<SelectInput
							label='Status'
							onChange={value => updateField('status', value)}
							options={['Ativo', 'Arquivado', 'Suspenso', 'Encerrado']}
							value={formData.status}
						/>
						<TextInput
							label='Código Interno'
							onChange={value => updateField('internalCode', value)}
							value={formData.internalCode}
						/>
						<SelectInput
							label='Tipo de Pesquisa'
							onChange={value => updateField('searchType', value)}
							options={['Padrão', 'Especial']}
							value={formData.searchType}
						/>
						<TextInput
							label='Código'
							onChange={value => updateField('code', value)}
							value={formData.code}
						/>
						<TextInput
							label='Juiz'
							onChange={value => updateField('judge', value)}
							value={formData.judge}
						/>
					</div>
				</div>

				{/* Localização e Responsáveis */}
				<div className='mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
					<h2 className='mb-6 font-semibold text-[#161C24] text-lg'>
						{SECTION_TITLES.LOCATION_RESPONSIBLE}
					</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						<SelectInput
							label='Área'
							onChange={value => updateField('area', value)}
							options={[
								'Cível Contencioso',
								'Trabalhista',
								'Tributário',
								'Criminal',
								'Administrativo',
								'Consumidor',
								'Família',
								'Empresarial'
							]}
							value={formData.area}
						/>
						<TextInput
							label='SubÁrea'
							onChange={value => updateField('subArea', value)}
							value={formData.subArea}
						/>
						<TextInput
							label='Núcleo'
							onChange={value => updateField('nucleus', value)}
							value={formData.nucleus}
						/>
						<TextInput
							label='Comarca'
							onChange={value => updateField('district', value)}
							value={formData.district}
						/>
						<TextInput
							label='Foro'
							onChange={value => updateField('forum', value)}
							value={formData.forum}
						/>
						<TextInput
							label='Vara'
							onChange={value => updateField('court', value)}
							value={formData.court}
						/>
						<TextInput
							label='Sócio'
							onChange={value => updateField('partner', value)}
							value={formData.partner}
						/>
						<TextInput
							label='Coordenador'
							onChange={value => updateField('coordinator', value)}
							value={formData.coordinator}
						/>
						<TextInput
							label='Advogado'
							onChange={value => updateField('lawyer', value)}
							value={formData.lawyer}
						/>
					</div>
				</div>

				{/* Partes */}
				<div className='mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
					<h2 className='mb-6 font-semibold text-[#161C24] text-lg'>
						{SECTION_TITLES.PROCESS_PARTIES}
					</h2>

					<div className='mb-8'>
						<h3 className='mb-4 font-semibold text-[#161C24] text-md'>
							{SECTION_TITLES.ACTIVE_PARTY}
						</h3>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
							<TextInput
								label='Nome'
								onChange={value =>
									updateNestedField('activePole', 'name', value)
								}
								value={formData.activePole.name}
							/>
							<TextInput
								label='CPF/CNPJ'
								onChange={value =>
									updateNestedField('activePole', 'document', value)
								}
								value={formData.activePole.document}
							/>
							<SelectInput
								label='Tipo'
								onChange={value =>
									updateNestedField('activePole', 'type', value)
								}
								options={['Autor', 'Requerente', 'Exequente', 'Impetrante']}
								value={formData.activePole.type}
							/>
						</div>
					</div>

					<div>
						<h3 className='mb-4 font-semibold text-[#161C24] text-md'>
							{SECTION_TITLES.PASSIVE_PARTY}
						</h3>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
							<TextInput
								label='Nome'
								onChange={value =>
									updateNestedField('passivePole', 'name', value)
								}
								value={formData.passivePole.name}
							/>
							<TextInput
								label='CPF/CNPJ'
								onChange={value =>
									updateNestedField('passivePole', 'document', value)
								}
								value={formData.passivePole.document}
							/>
							<SelectInput
								label='Tipo'
								onChange={value =>
									updateNestedField('passivePole', 'type', value)
								}
								options={['Réu', 'Requerido', 'Executado', 'Impetrado']}
								value={formData.passivePole.type}
							/>
						</div>
					</div>
				</div>

				{/* Valores */}
				<div className='mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
					<h2 className='mb-6 font-semibold text-[#161C24] text-lg'>
						{SECTION_TITLES.VALUES}
					</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						<TextInput
							label='Valor da Causa'
							onChange={value => updateField('caseValue', value)}
							placeholder='R$ 0,00'
							value={formData.caseValue}
						/>
						<TextInput
							label='Custas'
							onChange={value => updateField('costs', value)}
							placeholder='R$ 0,00'
							value={formData.costs}
						/>
						<TextInput
							label='Honorários'
							onChange={value => updateField('fees', value)}
							placeholder='R$ 0,00'
							value={formData.fees}
						/>
					</div>
				</div>

				{/* Informações Detalhadas */}
				<div className='mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
					<h2 className='mb-6 font-semibold text-[#161C24] text-lg'>
						{SECTION_TITLES.DETAILED_INFO}
					</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						<TextareaInput
							label='Observação'
							onChange={value => updateField('observation', value)}
							value={formData.observation}
						/>
						<TextareaInput
							label='Detalhamento do Objeto'
							onChange={value => updateField('objectDetails', value)}
							value={formData.objectDetails}
						/>
					</div>
				</div>

				{/* Buttons */}
				<div className='flex justify-end gap-4'>
					<button
						className='rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-[#637381] text-sm transition-colors hover:bg-gray-50'
						onClick={() => navigate('/dashboard/folders/consultation')}
						type='button'
					>
						{BUTTON_LABELS.CANCEL}
					</button>
					<button
						className='rounded-lg bg-[#00B8D9] px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#00B8D9]/90'
						type='submit'
					>
						{BUTTON_LABELS.SAVE}
					</button>
				</div>
			</form>
		</div>
	)
}
