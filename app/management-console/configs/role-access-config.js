import { UserTypeEnums, DepartmentTypeEnums } from '../../lib/enums';

const {
	ADMIN,
	MANAGER,
} = UserTypeEnums;
const {
	PROVIDER,
	CONSUMER,
} = DepartmentTypeEnums;
const RuleEnums = {
	ACCOUNT_MANAGER_PAGE: 'account-manager-page',
	ACCOUNT_DISPATCHERS_PAGE: 'account-dispatchers-page',
	ACCOUNT_HANDLERS_PAGE: 'account-handlers-page',
	PERMISSION_TO_ADD_STAFF: 'permission-to-add-staff',
};
const {
	ACCOUNT_MANAGER_PAGE,
	ACCOUNT_DISPATCHERS_PAGE,
	ACCOUNT_HANDLERS_PAGE,
	PERMISSION_TO_ADD_STAFF,
} = RuleEnums;
const rules = {
	[ADMIN]: {
		static: [
			ACCOUNT_MANAGER_PAGE,
			ACCOUNT_DISPATCHERS_PAGE,
			ACCOUNT_HANDLERS_PAGE,
		],
		dynamic: {
			[PERMISSION_TO_ADD_STAFF]: permissionToAddStaff,
		},
	},
	[MANAGER]: {
		static: [],
		dynamic: {
			[ACCOUNT_DISPATCHERS_PAGE]: ({ departmentType }) => {
				if (!departmentType) {
					return false;
				}

				return departmentType === PROVIDER;
			},
			[ACCOUNT_HANDLERS_PAGE]: ({ departmentType }) => {
				if (!departmentType) {
					return false;
				}

				return departmentType === CONSUMER;
			},
			[PERMISSION_TO_ADD_STAFF]: permissionToAddStaff,
		},
	},
};

function permissionToAddStaff(hasPermissionToAddStaff) {
	return Boolean(hasPermissionToAddStaff);
}

export {
	RuleEnums,
	rules,
};
