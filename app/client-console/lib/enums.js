import { DepartmentTypeEnums } from '../../lib/enums';

export {
	LoadingStatusEnum,
	UserTypeEnums,
	ShiftTypeEnums,
	OrderStatusEnums,
} from '../../lib/enums';

export const FileTypeEnums = {
	IMAGE: 'image',
	VIDEO: 'video',
};

export const ClientDepartmentTypeEnums = {
	...DepartmentTypeEnums,
	OWNER: 'owner',
};

export const OrderTypeEnums = {
	PROCESSING: 'processing',
	TRACKED: 'tracked',
	CLOSED: 'closed',
};
