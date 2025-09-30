import {aiChatHandlers} from './handlers/ai-chat'
import {authHandlers} from './handlers/auth'
import {dashboardHandlers} from './handlers/dashboard'
import {folderHandlers} from './handlers/folders'
import {taskHandlers} from './handlers/tasks'
import {userHandlers} from './handlers/users'

export const handlers = [
	...authHandlers,
	...folderHandlers,
	...taskHandlers,
	...dashboardHandlers,
	...userHandlers,
	...aiChatHandlers
]
