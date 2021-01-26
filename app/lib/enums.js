export const LoadingStatusEnum = {
	NONE: 0,
	SUCCESS: 1,
	FAILED: 2,
	LOADING: 3,
};

export const UserTypeEnums = {
	ADMIN: 'admin',
	MANAGER: 'manager',
	STAFF: 'staff',
};

const { ADMIN, MANAGER, STAFF } = UserTypeEnums;

export const UserTypeDisplayNameEnums = {
	[ADMIN]: '最高权限帐号',
	[MANAGER]: '部门主管',
	[STAFF]: '部门人员',
};

export const DepartmentTypeEnums = {
	PROVIDER: 'provider',
	CONSUMER: 'consumer',
};

const { PROVIDER, CONSUMER } = DepartmentTypeEnums;

export const DepartmentTypeDisplayNameEnums = {
	[PROVIDER]: '开单组',
	[CONSUMER]: '接单组',
};

export const ShiftTypeEnums = {
	MORNING: 'morning',
	NOON: 'noon',
	NIGHT: 'night',
};

const { MORNING, NOON, NIGHT } = ShiftTypeEnums;

export const ShiftTypeDisplayNameEnums = {
	[MORNING]: '早班',
	[NOON]: '午班',
	[NIGHT]: '晚班',
};

export const OrderStatusEnums = {
	CREATED: 'created', // 處理中 (無人接單)
	ACCEPTED: 'accepted', // 處理中 (已被接單)
	RESOLVED: 'resolved', // 處理中 (接單組按下完成)
	TRACKED: 'tracked', // 追蹤中
	COMPLETED: 'completed', // 已結單/刪除 (發單組按下結單)
	DELETED: 'deleted', // 已結單/刪除 (發單組按下刪除)
	CO_OWNER: 'co-owner', // 開單組邀請協作
	CO_HANDLER: 'co-handler', // 接單組邀請協作
	TRANSFERRED_OWNER: 'transferred-owner', // 開單組轉接派單
	TRANSFERRED_HANDLER: 'transferred-handler', // 接單組轉接派單
};

const {
	CREATED,
	ACCEPTED,
	RESOLVED,
	TRACKED,
	COMPLETED,
	DELETED,
} = OrderStatusEnums;

export const OrderStatusDisplayNameEnums = {
	[CREATED]: '处理中',
	[ACCEPTED]: '处理中',
	[RESOLVED]: '处理中',
	[TRACKED]: '追踪中',
	[COMPLETED]: '已结单/删除',
	[DELETED]: '已结单/删除',
};
