import {Search} from 'lucide-react'
import {useState} from 'react'
import type {FolderDetail} from '../types/folder.types'
import {FormField} from './form/FormField'
import {FormSection} from './form/FormSection'
import {ToggleSwitch} from './form/ToggleSwitch'

interface FolderProcessFormProps {
	folder: FolderDetail
}

export function FolderProcessForm({folder}: FolderProcessFormProps) {
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
		totus: folder.totus || false,
		migrated: folder.migrated || false,
		
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
		activePole: folder.activePole || false,
		passivePole: folder.passivePole || false,
		
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
					<h2 className='text-lg font-semibold text-gray-900'>Processo</h2>
					<div className='relative w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
						<input
							type='text'
							placeholder='Buscar'
							className='w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]'
						/>
					</div>
				</div>
			</div>

			{/* Form Content */}
			<div className='p-6 space-y-8'>
				{/* Identification Section */}
				<FormSection>
					<FormField
						label="N° Processo"
						value={formData.processNumber}
						onChange={(value) => updateField('processNumber', value)}
						placeholder="Digite o número do processo"
					/>
					<FormField
						label="N° CNJ"
						value={formData.cnjNumber}
						onChange={(value) => updateField('cnjNumber', value)}
						placeholder="0000000-00.0000.0.00.0000"
					/>
					<FormField
						label="Instância"
						type="select"
						value={formData.instance}
						onChange={(value) => updateField('instance', value)}
						options={[
							{value: 'Primeira Instância', label: 'Primeira Instância'},
							{value: 'Segunda Instância', label: 'Segunda Instância'},
							{value: 'Tribunais Superiores', label: 'Tribunais Superiores'}
						]}
					/>
					<FormField
						label="Natureza"
						type="select"
						value={formData.nature}
						onChange={(value) => updateField('nature', value)}
						options={[
							{value: 'Cível', label: 'Cível'},
							{value: 'Criminal', label: 'Criminal'},
							{value: 'Trabalhista', label: 'Trabalhista'},
							{value: 'Tributário', label: 'Tributário'}
						]}
					/>
				</FormSection>

				{/* Process Information */}
				<FormSection>
					<FormField
						label="Tipo ação"
						type="select"
						value={formData.actionType}
						onChange={(value) => updateField('actionType', value)}
						options={[
							{value: 'Ordinária', label: 'Ordinária'},
							{value: 'Sumária', label: 'Sumária'},
							{value: 'Execução', label: 'Execução'},
							{value: 'Cautelar', label: 'Cautelar'}
						]}
					/>
					<FormField
						label="Fase"
						type="select"
						value={formData.phase}
						onChange={(value) => updateField('phase', value)}
						options={[
							{value: 'Conhecimento', label: 'Conhecimento'},
							{value: 'Recursal', label: 'Recursal'},
							{value: 'Execução', label: 'Execução'},
							{value: 'Cumprimento de Sentença', label: 'Cumprimento de Sentença'}
						]}
					/>
					<FormField
						label="Eletrônico"
						type="select"
						value={formData.electronic}
						onChange={(value) => updateField('electronic', value)}
						options={[
							{value: 'Sim', label: 'Sim'},
							{value: 'Não', label: 'Não'}
						]}
					/>
					<FormField
						label="Cod. cliente"
						value={formData.clientCode}
						onChange={(value) => updateField('clientCode', value)}
						placeholder="Código do cliente"
					/>
					<FormField
						label="Pasta"
						value={formData.folderCode}
						onChange={(value) => updateField('folderCode', value)}
						placeholder="Código da pasta"
					/>
					<FormField
						label="Caso padrão faturamento"
						type="select"
						value={formData.defaultBilling}
						onChange={(value) => updateField('defaultBilling', value)}
						options={[
							{value: 'Sim', label: 'Sim'},
							{value: 'Não', label: 'Não'}
						]}
					/>
					<div className='flex items-center gap-6'>
						<label className='flex items-center gap-2'>
							<input
								type='checkbox'
								checked={formData.totus}
								onChange={(e) => updateField('totus', e.target.checked)}
								className='w-4 h-4 text-[#00B8D9] border-gray-300 rounded focus:ring-[#00B8D9]'
							/>
							<span className='text-sm text-gray-700'>TOTUS</span>
						</label>
						<label className='flex items-center gap-2'>
							<input
								type='checkbox'
								checked={formData.migrated}
								onChange={(e) => updateField('migrated', e.target.checked)}
								className='w-4 h-4 text-[#00B8D9] border-gray-300 rounded focus:ring-[#00B8D9]'
							/>
							<span className='text-sm text-gray-700'>Migrado</span>
						</label>
					</div>
				</FormSection>

				{/* Court Information */}
				<FormSection>
					<FormField
						label="Órgão"
						type="select"
						value={formData.organ}
						onChange={(value) => updateField('organ', value)}
						options={[
							{value: 'TJSP', label: 'TJSP'},
							{value: 'TJRJ', label: 'TJRJ'},
							{value: 'TJMG', label: 'TJMG'},
							{value: 'TRF', label: 'TRF'},
							{value: 'STJ', label: 'STJ'},
							{value: 'STF', label: 'STF'}
						]}
					/>
					<FormField
						label="Distribuição"
						type="select"
						value={formData.distribution}
						onChange={(value) => updateField('distribution', value)}
						options={[
							{value: 'Sorteio', label: 'Sorteio'},
							{value: 'Dependência', label: 'Dependência'},
							{value: 'Prevenção', label: 'Prevenção'}
						]}
						icon="calendar"
					/>
					<FormField
						label="Entrada"
						type="date"
						value={formData.entryDate}
						onChange={(value) => updateField('entryDate', value)}
						icon="calendar"
					/>
					<FormField
						label="Status"
						type="select"
						value={formData.status}
						onChange={(value) => updateField('status', value)}
						options={[
							{value: 'Ativo', label: 'Ativo'},
							{value: 'Suspenso', label: 'Suspenso'},
							{value: 'Arquivado', label: 'Arquivado'},
							{value: 'Concluído', label: 'Concluído'}
						]}
					/>
					<FormField
						label="Cód.Interno"
						value={formData.internalCode}
						onChange={(value) => updateField('internalCode', value)}
						placeholder="Código interno"
					/>
					<FormField
						label="Tipo Pesquisa"
						type="select"
						value={formData.searchType}
						onChange={(value) => updateField('searchType', value)}
						options={[
							{value: 'Padrão', label: 'Padrão'},
							{value: 'Avançada', label: 'Avançada'},
							{value: 'Personalizada', label: 'Personalizada'}
						]}
					/>
					<FormField
						label="Código"
						value={formData.code}
						onChange={(value) => updateField('code', value)}
						placeholder="Código"
					/>
					<FormField
						label="Juiz"
						value={formData.judge}
						onChange={(value) => updateField('judge', value)}
						placeholder="Nome do juiz"
					/>
				</FormSection>

				{/* Additional Details */}
				<FormSection>
					<FormField
						label="Área"
						type="select"
						value={formData.area}
						onChange={(value) => updateField('area', value)}
						options={[
							{value: 'Cível', label: 'Cível'},
							{value: 'Trabalhista', label: 'Trabalhista'},
							{value: 'Criminal', label: 'Criminal'},
							{value: 'Tributário', label: 'Tributário'}
						]}
					/>
					<FormField
						label="Comarca"
						type="select"
						value={formData.comarca}
						onChange={(value) => updateField('comarca', value)}
						placeholder="Selecione a comarca"
						options={[
							{value: 'São Paulo', label: 'São Paulo'},
							{value: 'Rio de Janeiro', label: 'Rio de Janeiro'},
							{value: 'Belo Horizonte', label: 'Belo Horizonte'}
						]}
					/>
					<FormField
						label="Sócio"
						type="select"
						value={formData.partner}
						onChange={(value) => updateField('partner', value)}
						placeholder="Selecione o sócio"
						options={[
							{value: 'Dr. João Silva', label: 'Dr. João Silva'},
							{value: 'Dra. Maria Santos', label: 'Dra. Maria Santos'}
						]}
					/>
					<FormField
						label="SubÁrea"
						type="select"
						value={formData.subArea}
						onChange={(value) => updateField('subArea', value)}
						placeholder="Selecione a subárea"
						options={[
							{value: 'Contratos', label: 'Contratos'},
							{value: 'Família', label: 'Família'},
							{value: 'Consumidor', label: 'Consumidor'}
						]}
					/>
					<FormField
						label="Foro"
						type="select"
						value={formData.court}
						onChange={(value) => updateField('court', value)}
						placeholder="Selecione o foro"
						options={[
							{value: 'Central', label: 'Central'},
							{value: 'Regional', label: 'Regional'}
						]}
					/>
					<FormField
						label="Coordenador"
						type="select"
						value={formData.coordinator}
						onChange={(value) => updateField('coordinator', value)}
						placeholder="Selecione o coordenador"
						options={[
							{value: 'Carlos Mendes', label: 'Carlos Mendes'},
							{value: 'Ana Costa', label: 'Ana Costa'}
						]}
					/>
					<FormField
						label="Núcleo"
						type="select"
						value={formData.nucleus}
						onChange={(value) => updateField('nucleus', value)}
						placeholder="Selecione o núcleo"
						options={[
							{value: 'Norte', label: 'Norte'},
							{value: 'Sul', label: 'Sul'},
							{value: 'Centro', label: 'Centro'}
						]}
					/>
					<FormField
						label="Vara"
						type="select"
						value={formData.stick}
						onChange={(value) => updateField('stick', value)}
						placeholder="Selecione a vara"
						options={[
							{value: '1ª Vara', label: '1ª Vara'},
							{value: '2ª Vara', label: '2ª Vara'},
							{value: '3ª Vara', label: '3ª Vara'}
						]}
					/>
					<FormField
						label="Advogado"
						type="select"
						value={formData.lawyer}
						onChange={(value) => updateField('lawyer', value)}
						placeholder="Selecione o advogado"
						options={[
							{value: 'Dr. Pedro Lima', label: 'Dr. Pedro Lima'},
							{value: 'Dra. Julia Martins', label: 'Dra. Julia Martins'}
						]}
					/>
				</FormSection>

				{/* Poles Section */}
				<div className='border-t border-gray-100 pt-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='bg-gray-50 rounded-lg p-4'>
							<ToggleSwitch
								label="Polo ativo"
								checked={formData.activePole}
								onChange={(checked) => updateField('activePole', checked)}
							/>
						</div>
						<div className='bg-gray-50 rounded-lg p-4'>
							<ToggleSwitch
								label="Polo passivo"
								checked={formData.passivePole}
								onChange={(checked) => updateField('passivePole', checked)}
							/>
						</div>
					</div>
				</div>

				{/* Observations Section */}
				<div className='border-t border-gray-100 pt-6'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<FormField
							label="Observação"
							type="textarea"
							value={formData.observation}
							onChange={(value) => updateField('observation', value)}
							placeholder="Digite aqui..."
							colSpan={1}
						/>
						<FormField
							label="Detalhamento do objeto"
							type="textarea"
							value={formData.objectDetail}
							onChange={(value) => updateField('objectDetail', value)}
							placeholder="Digite aqui..."
							colSpan={1}
						/>
						<FormField
							label="Último andamento"
							type="textarea"
							value={formData.lastUpdate}
							onChange={(value) => updateField('lastUpdate', value)}
							placeholder="Digite aqui..."
							colSpan={1}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}