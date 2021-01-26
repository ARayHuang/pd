const {
	getActiveUsersAndActiveChannelsByTypeAndPagination,

	USER_PROJECTIONS,
} = require('../../../services/user');
const {
	publisher: { getOnlineUsers },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const {
		sort, limit, order,
		page, type, departmentType,
		shiftType, displayName, username,
	} = req.query;
	const { channelId, channelName, hasPermissionToAddStaff } = res.locals;

	try {
		const result = await getActiveUsersAndActiveChannelsByTypeAndPagination(type, page, {
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
			projections: USER_PROJECTIONS.USER,
		});
		const userIds = result.data.map(user => user.id);
		const onlineUsers = await getOnlineUsers({ userIds });
		const onlineUserIds = onlineUsers.map(user => user.id);

		result.data.forEach(user => {
			user.isOnline = onlineUserIds.includes(`${user.id}`);
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
