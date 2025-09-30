import {ActiveFoldersCard} from './Widgets/ActiveFoldersCard'
import {AreaDivisionCard} from './Widgets/AreaDivisionCard'
import {BillingCard} from './Widgets/BillingCard'
import {BirthdaysCard} from './Widgets/BirthdaysCard'
import {FolderActivityCard} from './Widgets/FolderActivityCard'
import {HearingsCard} from './Widgets/HearingsCard'
import {RequestsCard} from './Widgets/RequestsCard'
import {TasksCard} from './Widgets/TasksCard'

export function DashboardContent() {
	return (
		<div className='p-6'>
			<div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
				<ActiveFoldersCard />
				<AreaDivisionCard />
				<FolderActivityCard />
			</div>

			<div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
				<TasksCard />
				<RequestsCard />
			</div>

			<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
				<div className='lg:col-span-2'>
					<HearingsCard />
				</div>
				<div className='flex flex-col gap-6'>
					<BillingCard />
					<BirthdaysCard />
				</div>
			</div>
		</div>
	)
}
