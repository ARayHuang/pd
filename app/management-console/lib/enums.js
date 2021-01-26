export {
	LoadingStatusEnum,
	UserTypeEnums,
	UserTypeDisplayNameEnums,
	DepartmentTypeEnums,
	DepartmentTypeDisplayNameEnums,
	ShiftTypeEnums,
	ShiftTypeDisplayNameEnums,
} from '../../lib/enums';
import { StatusTag } from 'ljit-react-components';

export const OnlineEnums = {
	ONLINE: true,
	OFFLINE: false,
};

const { ONLINE, OFFLINE } = OnlineEnums;

export const OnlineDisplayNameEnums = {
	[ONLINE]: '上线',
	[OFFLINE]: '下线',
};

export const StatusTagEnums = {
	[ONLINE]: {
		status: StatusTag.StatusEnums.SUCCESS,
		text: OnlineDisplayNameEnums[ONLINE],
	},
	[OFFLINE]: {
		status: StatusTag.StatusEnums.ERROR,
		text: OnlineDisplayNameEnums[OFFLINE],
	},
};

export const TagsStatusEnums = {
	SELECTABLE: 'active',
	UNSELECTABLE: 'disabled',
};

export const FileTypeEnums = {
	IMAGE: 'image',
	VIDEO: 'video',
};

export const LogTypeEnums = {
	CREATED: 'created-order',
	ACCEPTED: 'accepted-order',
	RESOLVED: 'resolved-order',
	TRACKED: 'tracked-order',
	COMPLETED: 'completed-order',
	DELETED: 'deleted-order',
	TRANSFERED: 'transferred-order',
	INVITED: 'invited-user-into-order',
	UPDATED_ORDER_DESCRIPTION: 'updated-order-description',
};
