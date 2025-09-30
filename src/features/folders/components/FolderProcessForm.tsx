import {Search} from 'lucide-react'
import {useState} from 'react'
import {useTranslation} from '@/core/i18n'
import type {FolderDetail} from '../types/folder.types'
import {FormField} from './form/FormField'
import {FormSection} from './form/FormSection'
import {ToggleSwitch} from './form/ToggleSwitch'

interface FolderProcessFormProps {
	folder: FolderDetail
}

export function FolderProcessForm({folder}: FolderProcessFormProps) {
	const {t} = useTranslation()

	// Form state
	const [formData, setFormData] = useState({
		// Identification
		processNumber: folder.processNumber || '',
		cnjNumber: folder.cnjNumber || '',
		instance: folder.instance || 'Primeira Instância',
		nature: folder.nature || 'Cível',

		// Process Information
		actionType: folder.actionType || 'Ordinária',
		phase: folder.phase || 'Conhecimento',
		electronic: folder.electronic || 'Sim',
		clientCode: folder.clientCode || '',
		folderCode: folder.folder || '',
		defaultBilling: folder.defaultBillingCase || 'Sim',
		totus: folder.totus,
		migrated: folder.migrated,

		// Court Information
		organ: folder.organ || 'TJSP',
		distribution: folder.distribution || 'Sorteio',
		entryDate: folder.entryDate || '',
		status: folder.status || 'Ativo',
		internalCode: folder.internalCode || '',
		searchType: folder.searchType || 'Padrão',
		code: folder.code || '',
		judge: folder.judge || '',

		// Additional Details
		area: folder.area || '',
		comarca: folder.comarca || '',
		partner: folder.partner || '',
		subArea: folder.subArea || '',
		court: folder.court || '',
		coordinator: folder.coordinator || '',
		nucleus: folder.nucleus || '',
		stick: folder.stick || '',
		lawyer: folder.lawyer || '',

		// Poles
		activePole: folder.activePole,
		passivePole: folder.passivePole,

		// Observations
		observation: folder.observation || '',
		objectDetail: folder.objectDetail || '',
		lastUpdate: folder.lastUpdate || ''
	})

	const updateField = (field: string, value: string | boolean) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
			{/* Header with Search */}
			<div className='px-6 py-4 border-b border-gray-100'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-semibold text-gray-900'>
						{t('folders.process.title')}
					</h2>
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
						options={[
							{value: 'Primeira Instância', label: 'Primeira Instância'},
							{value: 'Segunda Instância', label: 'Segunda Instância'},
							{value: 'Tribunais Superiores', label: 'Tribunais Superiores'}
						]}
						type='select'
						value={formData.instance}
					/>
					<FormField
						label='Natureza'
						onChange={value => updateField('nature', value)}
						options={[
							{value: 'Cível', label: 'Cível'},
							{value: 'Criminal', label: 'Criminal'},
							{value: 'Trabalhista', label: 'Trabalhista'},
							{value: 'Tributário', label: 'Tributário'}
						]}
						type='select'
						value={formData.nature}
					/>
				</FormSection>

				{/* Process Information */}
				<FormSection>
					<FormField
						label='Tipo ação'
						onChange={value => updateField('actionType', value)}
						options={[
							{value: 'Ordinária', label: 'Ordinária'},
							{value: 'Sumária', label: 'Sumária'},
							{value: 'Execução', label: 'Execução'},
							{value: 'Cautelar', label: 'Cautelar'}
						]}
						type='select'
						value={formData.actionType}
					/>
					<FormField
						label='Fase'
						onChange={value => updateField('phase', value)}
						options={[
							{value: 'Conhecimento', label: 'Conhecimento'},
							{value: 'Recursal', label: 'Recursal'},
							{value: 'Execução', label: 'Execução'},
							{
								value: 'Cumprimento de Sentença',
								label: 'Cumprimento de Sentença'
							}
						]}
						type='select'
						value={formData.phase}
					/>
					<FormField
						label='Eletrônico'
						onChange={value => updateField('electronic', value)}
						options={[
							{value: 'Sim', label: 'Sim'},
							{value: 'Não', label: 'Não'}
						]}
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
						options={[
							{value: 'Sim', label: 'Sim'},
							{value: 'Não', label: 'Não'}
						]}
						type='select'
						value={formData.defaultBilling}
					/>
					<div className='flex items-center gap-6'>
						<label className='flex items-center gap-2'>
							<input
								checked={formData.totus}
								className='w-4 h-4 text-[#00B8D9] border-gray-300 rounded focus:ring-[#00B8D9]'
								onChange={e => updateField('totus', e.target.checked)}
								type='checkbox'
							/>
							<span className='text-sm text-gray-700'>
								{t('folders.process.systems.totus')}
							</span>
						</label>
						<label className='flex items-center gap-2'>
							<input
								checked={formData.migrated}
								className='w-4 h-4 text-[#00B8D9] border-gray-300 rounded focus:ring-[#00B8D9]'
								onChange={e => updateField('migrated', e.target.checked)}
								type='checkbox'
							/>
							<span className='text-sm text-gray-700'>
								{t('folders.process.systems.migrated')}
							</span>
						</label>
					</div>
				</FormSection>

				{/* Court Information */}
				<FormSection>
					<FormField
						label='Órgão'
						onChange={value => updateField('organ', value)}
						options={[
							{value: 'TJSP', label: 'TJSP'},
							{value: 'TJRJ', label: 'TJRJ'},
							{value: 'TJMG', label: 'TJMG'},
							{value: 'TRF', label: 'TRF'},
							{value: 'STJ', label: 'STJ'},
							{value: 'STF', label: 'STF'}
						]}
						type='select'
						value={formData.organ}
					/>
					<FormField
						icon='calendar'
						label='Distribuição'
						onChange={value => updateField('distribution', value)}
						options={[
							{value: 'Sorteio', label: 'Sorteio'},
							{value: 'Dependência', label: 'Dependência'},
							{value: 'Prevenção', label: 'Prevenção'}
						]}
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
						options={[
							{value: 'Ativo', label: 'Ativo'},
							{value: 'Suspenso', label: 'Suspenso'},
							{value: 'Arquivado', label: 'Arquivado'},
							{value: 'Concluído', label: 'Concluído'}
						]}
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
						options={[
							{value: 'Padrão', label: 'Padrão'},
							{value: 'Avançada', label: 'Avançada'},
							{value: 'Personalizada', label: 'Personalizada'}
						]}
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
						options={[
							{value: 'Cível', label: 'Cível'},
							{value: 'Trabalhista', label: 'Trabalhista'},
							{value: 'Criminal', label: 'Criminal'},
							{value: 'Tributário', label: 'Tributário'}
						]}
						type='select'
						value={formData.area}
					/>
					<FormField
						label='Comarca'
						onChange={value => updateField('comarca', value)}
						options={[
							{value: 'São Paulo', label: 'São Paulo'},
							{value: 'Rio de Janeiro', label: 'Rio de Janeiro'},
							{value: 'Belo Horizonte', label: 'Belo Horizonte'}
						]}
						placeholder='Selecione a comarca'
						type='select'
						value={formData.comarca}
					/>
					<FormField
						label='Sócio'
						onChange={value => updateField('partner', value)}
						options={[
							{value: 'Dr. João Silva', label: 'Dr. João Silva'},
							{value: 'Dra. Maria Santos', label: 'Dra. Maria Santos'}
						]}
						placeholder='Selecione o sócio'
						type='select'
						value={formData.partner}
					/>
					<FormField
						label='SubÁrea'
						onChange={value => updateField('subArea', value)}
						options={[
							{value: 'Contratos', label: 'Contratos'},
							{value: 'Família', label: 'Família'},
							{value: 'Consumidor', label: 'Consumidor'}
						]}
						placeholder='Selecione a subárea'
						type='select'
						value={formData.subArea}
					/>
					<FormField
						label='Foro'
						onChange={value => updateField('court', value)}
						options={[
							{value: 'Central', label: 'Central'},
							{value: 'Regional', label: 'Regional'}
						]}
						placeholder='Selecione o foro'
						type='select'
						value={formData.court}
					/>
					<FormField
						label='Coordenador'
						onChange={value => updateField('coordinator', value)}
						options={[
							{value: 'Carlos Mendes', label: 'Carlos Mendes'},
							{value: 'Ana Costa', label: 'Ana Costa'}
						]}
						placeholder='Selecione o coordenador'
						type='select'
						value={formData.coordinator}
					/>
					<FormField
						label='Núcleo'
						onChange={value => updateField('nucleus', value)}
						options={[
							{value: 'Norte', label: 'Norte'},
							{value: 'Sul', label: 'Sul'},
							{value: 'Centro', label: 'Centro'}
						]}
						placeholder='Selecione o núcleo'
						type='select'
						value={formData.nucleus}
					/>
					<FormField
						label='Vara'
						onChange={value => updateField('stick', value)}
						options={[
							{value: '1ª Vara', label: '1ª Vara'},
							{value: '2ª Vara', label: '2ª Vara'},
							{value: '3ª Vara', label: '3ª Vara'}
						]}
						placeholder='Selecione a vara'
						type='select'
						value={formData.stick}
					/>
					<FormField
						label='Advogado'
						onChange={value => updateField('lawyer', value)}
						options={[
							{value: 'Dr. Pedro Lima', label: 'Dr. Pedro Lima'},
							{value: 'Dra. Julia Martins', label: 'Dra. Julia Martins'}
						]}
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
