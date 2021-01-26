const UserStore = require('../stores/user');
const ChannelStore = require('../stores/channel');
const { ENUM_USER_TYPE } = require('../lib/enum');

async function getActiveUsersAndActiveChannelsByTypeAndPagination(type, page, {
	departmentType,
	shiftType,
	channelId,
	displayName,
	username,
	channelName,
	hasPermissionToAddStaff,
} = {}, {
	sort,
	limit,
	order,
} = {}) {
	const result = await UserStore.getActiveUsersAndActiveChannelsByTypeAndPagination(type, page, {
		departmentType,
		shiftType,
		channelId,
		displayName,
		username,
		channelName,
		hasPermissionToAddStaff,
	}, {
		sort,
		limit,
		order,
	});
	const ALL_CHANNELS_USER_TYPES = [
		ENUM_USER_TYPE.ADMIN,
		ENUM_USER_TYPE.MANAGER,
	];

	if (ALL_CHANNELS_USER_TYPES.includes(type)) {
		const activeChannels = await ChannelStore.getActiveChannels({
			projections: ChannelStore.NAME_ONLY_PROJECTIONS,
		});

		result.data.forEach(user => {
			user.channels = activeChannels;
		});
	}

	return result;
}

module.exports = {
	getActiveUserById: UserStore.getActiveUserById,
	getActiveUserByUsername: UserStore.getActiveUserByUsername,
	createManagerUser: UserStore.createManagerUser,
	createStaffUser: UserStore.createStaffUser,
	getActiveUsersAndActiveChannelsByTypeAndPagination,
	deleteActiveUserById: UserStore.deleteActiveUserById,
	updateMangerUserById: UserStore.updateMangerUserById,
	updateStaffUserById: UserStore.updateStaffUserById,
	updateChannelSettingsById: UserStore.updateChannelSettingsById,

	USER_PROJECTIONS: {
		ID: UserStore.ID_ONLY_PROJECTIONS,
		USER: UserStore.USER_PROJECTIONS,
		DEPARTMENT_TYPE_AND_DISPLAY_NAME: UserStore.DEPARTMENT_TYPE_AND_DISPLAY_NAME_PROJECTIONS,
	},
};
