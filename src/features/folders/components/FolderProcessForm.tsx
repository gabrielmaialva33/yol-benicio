import {Search} from 'lucide-react'
import {useState} from 'react'
import type {FolderDetail} from '../types/folder.types'
import {FormField} from './form/FormField'
import {FormSection} from './form/FormSection'
import {ToggleSwitch} from './form/ToggleSwitch'

interface FolderProcessFormProps {
	folder: FolderDetail
}

// Form options constants
const INSTANCE_OPTIONS = [
	{value: 'Primeira Instância', label: 'Primeira Instância'},
	{value: 'Segunda Instância', label: 'Segunda Instância'},
	{value: 'Tribunais Superiores', label: 'Tribunais Superiores'}
]

const NATURE_OPTIONS = [
	{value: 'Cível', label: 'Cível'},
	{value: 'Criminal', label: 'Criminal'},
	{value: 'Trabalhista', label: 'Trabalhista'},
	{value: 'Tributário', label: 'Tributário'}
]

const ACTION_TYPE_OPTIONS = [
	{value: 'Ordinária', label: 'Ordinária'},
	{value: 'Sumária', label: 'Sumária'},
	{value: 'Execução', label: 'Execução'},
	{value: 'Cautelar', label: 'Cautelar'}
]

const PHASE_OPTIONS = [
	{value: 'Conhecimento', label: 'Conhecimento'},
	{value: 'Recursal', label: 'Recursal'},
	{value: 'Execução', label: 'Execução'},
	{value: 'Cumprimento de Sentença', label: 'Cumprimento de Sentença'}
]

const YES_NO_OPTIONS = [
	{value: 'Sim', label: 'Sim'},
	{value: 'Não', label: 'Não'}
]

const ORGAN_OPTIONS = [
	{value: 'TJSP', label: 'TJSP'},
	{value: 'TJRJ', label: 'TJRJ'},
	{value: 'TJMG', label: 'TJMG'},
	{value: 'TRF', label: 'TRF'},
	{value: 'STJ', label: 'STJ'},
	{value: 'STF', label: 'STF'}
]

const DISTRIBUTION_OPTIONS = [
	{value: 'Sorteio', label: 'Sorteio'},
	{value: 'Dependência', label: 'Dependência'},
	{value: 'Prevenção', label: 'Prevenção'}
]

const STATUS_OPTIONS = [
	{value: 'Ativo', label: 'Ativo'},
	{value: 'Suspenso', label: 'Suspenso'},
	{value: 'Arquivado', label: 'Arquivado'},
	{value: 'Concluído', label: 'Concluído'}
]

const SEARCH_TYPE_OPTIONS = [
	{value: 'Padrão', label: 'Padrão'},
	{value: 'Avançada', label: 'Avançada'},
	{value: 'Personalizada', label: 'Personalizada'}
]

const AREA_OPTIONS = [
	{value: 'Cível', label: 'Cível'},
	{value: 'Trabalhista', label: 'Trabalhista'},
	{value: 'Criminal', label: 'Criminal'},
	{value: 'Tributário', label: 'Tributário'}
]

const COMARCA_OPTIONS = [
	{value: 'São Paulo', label: 'São Paulo'},
	{value: 'Rio de Janeiro', label: 'Rio de Janeiro'},
	{value: 'Belo Horizonte', label: 'Belo Horizonte'}
]

const PARTNER_OPTIONS = [
	{value: 'Dr. João Silva', label: 'Dr. João Silva'},
	{value: 'Dra. Maria Santos', label: 'Dra. Maria Santos'}
]

const SUB_AREA_OPTIONS = [
	{value: 'Contratos', label: 'Contratos'},
	{value: 'Família', label: 'Família'},
	{value: 'Consumidor', label: 'Consumidor'}
]

const COURT_OPTIONS = [
	{value: 'Central', label: 'Central'},
	{value: 'Regional', label: 'Regional'}
]

const COORDINATOR_OPTIONS = [
	{value: 'Carlos Mendes', label: 'Carlos Mendes'},
	{value: 'Ana Costa', label: 'Ana Costa'}
]

const NUCLEUS_OPTIONS = [
	{value: 'Norte', label: 'Norte'},
	{value: 'Sul', label: 'Sul'},
	{value: 'Centro', label: 'Centro'}
]

const VARA_OPTIONS = [
	{value: '1ª Vara', label: '1ª Vara'},
	{value: '2ª Vara', label: '2ª Vara'},
	{value: '3ª Vara', label: '3ª Vara'}
]

const LAWYER_OPTIONS = [
	{value: 'Dr. Pedro Lima', label: 'Dr. Pedro Lima'},
	{value: 'Dra. Julia Martins', label: 'Dra. Julia Martins'}
]

// Default values for form fields
const FORM_DEFAULTS = {
	processNumber: '',
	cnjNumber: '',
	instance: 'Primeira Instância',
	nature: 'Cível',
	actionType: 'Ordinária',
	phase: 'Conhecimento',
	electronic: 'Sim',
	clientCode: '',
	folderCode: '',
	defaultBilling: 'Sim',
	organ: 'TJSP',
	distribution: 'Sorteio',
	entryDate: '',
	status: 'Ativo',
	internalCode: '',
	searchType: 'Padrão',
	code: '',
	judge: '',
	area: '',
	comarca: '',
	partner: '',
	subArea: '',
	court: '',
	coordinator: '',
	nucleus: '',
	stick: '',
	lawyer: '',
	observation: '',
	objectDetail: '',
	lastUpdate: ''
}

// Helper function to create initial form data
const createInitialFormData = (folder: FolderDetail) => {
	const formData: Record<string, string | boolean> = {}

	// Map folder fields to form fields
	const fieldMappings: Record<string, keyof FolderDetail> = {
		folderCode: 'folder',
		defaultBilling: 'defaultBillingCase'
	}

	// Process fields with defaults
	for (const [key, defaultValue] of Object.entries(FORM_DEFAULTS)) {
		const folderKey = fieldMappings[key] || key
		formData[key] = folder[folderKey as keyof FolderDetail] || defaultValue
	}

	// Handle boolean fields that don't need defaults
	formData.totus = folder.totus
	formData.migrated = folder.migrated
	formData.activePole = folder.activePole
	formData.passivePole = folder.passivePole

	return formData
}

// Separate component for the header
function ProcessFormHeader() {
	return (
		<div className='px-6 py-4 border-b border-gray-100'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold text-gray-900'>Processo</h2>
				<div className='relative w-64'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
					<input
						className='w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]'
						placeholder='Buscar'
						type='text'
					/>
				</div>
			</div>
		</div>
	)
}

// Separate component for checkboxes
function ProcessCheckboxes({
	totus,
	migrated,
	onUpdate
}: {
	totus: boolean
	migrated: boolean
	onUpdate: (field: string, value: boolean) => void
}) {
	return (
		<div className='flex items-center gap-6'>
			<label className='flex items-center gap-2'>
				<input
					checked={totus}
					className='w-4 h-4 text-[#00B8D9] border-gray-300 rounded focus:ring-[#00B8D9]'
					onChange={e => onUpdate('totus', e.target.checked)}
					type='checkbox'
				/>
				<span className='text-sm text-gray-700'>TOTUS</span>
			</label>
			<label className='flex items-center gap-2'>
				<input
					checked={migrated}
					className='w-4 h-4 text-[#00B8D9] border-gray-300 rounded focus:ring-[#00B8D9]'
					onChange={e => onUpdate('migrated', e.target.checked)}
					type='checkbox'
				/>
				<span className='text-sm text-gray-700'>Migrado</span>
			</label>
		</div>
	)
}

export function FolderProcessForm({folder}: FolderProcessFormProps) {
	const [formData, setFormData] = useState(() => createInitialFormData(folder))

	const updateField = (field: string, value: string | boolean) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
			<ProcessFormHeader />

			{/* Form Content */}
			<div className='p-6 space-y-8'>
				{/* Identification Section */}
				<FormSection>
					<FormField
						label='N° Processo'
						onChange={value => updateField('processNumber', value)}
						placeholder='Digite o número do processo'
						value={formData.processNumber}
					/>
					<FormField
						label='N° CNJ'
						onChange={value => updateField('cnjNumber', value)}
						placeholder='0000000-00.0000.0.00.0000'
						value={formData.cnjNumber}
					/>
					<FormField
						label='Instância'
						onChange={value => updateField('instance', value)}
						options={INSTANCE_OPTIONS}
						type='select'
						value={formData.instance}
					/>
					<FormField
						label='Natureza'
						onChange={value => updateField('nature', value)}
						options={NATURE_OPTIONS}
						type='select'
						value={formData.nature}
					/>
				</FormSection>

				{/* Process Information */}
				<FormSection>
					<FormField
						label='Tipo ação'
						onChange={value => updateField('actionType', value)}
						options={ACTION_TYPE_OPTIONS}
						type='select'
						value={formData.actionType}
					/>
					<FormField
						label='Fase'
						onChange={value => updateField('phase', value)}
						options={PHASE_OPTIONS}
						type='select'
						value={formData.phase}
					/>
					<FormField
						label='Eletrônico'
						onChange={value => updateField('electronic', value)}
						options={YES_NO_OPTIONS}
						type='select'
						value={formData.electronic}
					/>
					<FormField
						label='Cod. cliente'
						onChange={value => updateField('clientCode', value)}
						placeholder='Código do cliente'
						value={formData.clientCode}
					/>
					<FormField
						label='Pasta'
						onChange={value => updateField('folderCode', value)}
						placeholder='Código da pasta'
						value={formData.folderCode}
					/>
					<FormField
						label='Caso padrão faturamento'
						onChange={value => updateField('defaultBilling', value)}
						options={YES_NO_OPTIONS}
						type='select'
						value={formData.defaultBilling}
					/>
					<ProcessCheckboxes
						migrated={formData.migrated}
						onUpdate={updateField}
						totus={formData.totus}
					/>
				</FormSection>

				{/* Court Information */}
				<FormSection>
					<FormField
						label='Órgão'
						onChange={value => updateField('organ', value)}
						options={ORGAN_OPTIONS}
						type='select'
						value={formData.organ}
					/>
					<FormField
						icon='calendar'
						label='Distribuição'
						onChange={value => updateField('distribution', value)}
						options={DISTRIBUTION_OPTIONS}
						type='select'
						value={formData.distribution}
					/>
					<FormField
						icon='calendar'
						label='Entrada'
						onChange={value => updateField('entryDate', value)}
						type='date'
						value={formData.entryDate}
					/>
					<FormField
						label='Status'
						onChange={value => updateField('status', value)}
						options={STATUS_OPTIONS}
						type='select'
						value={formData.status}
					/>
					<FormField
						label='Cód.Interno'
						onChange={value => updateField('internalCode', value)}
						placeholder='Código interno'
						value={formData.internalCode}
					/>
					<FormField
						label='Tipo Pesquisa'
						onChange={value => updateField('searchType', value)}
						options={SEARCH_TYPE_OPTIONS}
						type='select'
						value={formData.searchType}
					/>
					<FormField
						label='Código'
						onChange={value => updateField('code', value)}
						placeholder='Código'
						value={formData.code}
					/>
					<FormField
						label='Juiz'
						onChange={value => updateField('judge', value)}
						placeholder='Nome do juiz'
						value={formData.judge}
					/>
				</FormSection>

				{/* Additional Details */}
				<FormSection>
					<FormField
						label='Área'
						onChange={value => updateField('area', value)}
						options={AREA_OPTIONS}
						type='select'
						value={formData.area}
					/>
					<FormField
						label='Comarca'
						onChange={value => updateField('comarca', value)}
						options={COMARCA_OPTIONS}
						placeholder='Selecione a comarca'
						type='select'
						value={formData.comarca}
					/>
					<FormField
						label='Sócio'
						onChange={value => updateField('partner', value)}
						options={PARTNER_OPTIONS}
						placeholder='Selecione o sócio'
						type='select'
						value={formData.partner}
					/>
					<FormField
						label='SubÁrea'
						onChange={value => updateField('subArea', value)}
						options={SUB_AREA_OPTIONS}
						placeholder='Selecione a subárea'
						type='select'
						value={formData.subArea}
					/>
					<FormField
						label='Foro'
						onChange={value => updateField('court', value)}
						options={COURT_OPTIONS}
						placeholder='Selecione o foro'
						type='select'
						value={formData.court}
					/>
					<FormField
						label='Coordenador'
						onChange={value => updateField('coordinator', value)}
						options={COORDINATOR_OPTIONS}
						placeholder='Selecione o coordenador'
						type='select'
						value={formData.coordinator}
					/>
					<FormField
						label='Núcleo'
						onChange={value => updateField('nucleus', value)}
						options={NUCLEUS_OPTIONS}
						placeholder='Selecione o núcleo'
						type='select'
						value={formData.nucleus}
					/>
					<FormField
						label='Vara'
						onChange={value => updateField('stick', value)}
						options={VARA_OPTIONS}
						placeholder='Selecione a vara'
						type='select'
						value={formData.stick}
					/>
					<FormField
						label='Advogado'
						onChange={value => updateField('lawyer', value)}
						options={LAWYER_OPTIONS}
						placeholder='Selecione o advogado'
						type='select'
						value={formData.lawyer}
					/>
				</FormSection>

				{/* Poles Section */}
				<div className='border-t border-gray-100 pt-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='bg-gray-50 rounded-lg p-4'>
							<ToggleSwitch
								checked={formData.activePole}
								label='Polo ativo'
								onChange={checked => updateField('activePole', checked)}
							/>
						</div>
						<div className='bg-gray-50 rounded-lg p-4'>
							<ToggleSwitch
								checked={formData.passivePole}
								label='Polo passivo'
								onChange={checked => updateField('passivePole', checked)}
							/>
						</div>
					</div>
				</div>

				{/* Observations Section */}
				<div className='border-t border-gray-100 pt-6'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<FormField
							colSpan={1}
							label='Observação'
							onChange={value => updateField('observation', value)}
							placeholder='Digite aqui...'
							type='textarea'
							value={formData.observation}
						/>
						<FormField
							colSpan={1}
							label='Detalhamento do objeto'
							onChange={value => updateField('objectDetail', value)}
							placeholder='Digite aqui...'
							type='textarea'
							value={formData.objectDetail}
						/>
						<FormField
							colSpan={1}
							label='Último andamento'
							onChange={value => updateField('lastUpdate', value)}
							placeholder='Digite aqui...'
							type='textarea'
							value={formData.lastUpdate}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
