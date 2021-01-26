const {
	NotFoundError,
} = require('ljit-error');
const {
	ENUM_USER_TYPE,
} = require('../../../lib/enum');
const {
	USER_NOT_FOUND,
} = require('../../../lib/error/code');
const {
	getActiveChannels,
	getActiveChannelsByIds,

	CHANNEL_PROJECTIONS,
} = require('../../../services/channel');
const {
	getActiveUserById,

	USER_PROJECTIONS,
} = require('../../../services/user');
const {
	publisher: { getOnlineUsers },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const {
		userId,
	} = req.params;

	try {
		const user = await getActiveUserById(userId, {
			projections: USER_PROJECTIONS.USER,
		});

		if (user === null) {
			throw new NotFoundError(USER_NOT_FOUND.MESSAGE, USER_NOT_FOUND.CODE);
		}

		const result = user.toJSON();
		const onlineUsers = await getOnlineUsers({ userIds: user.id });

		if (user.type === ENUM_USER_TYPE.STAFF) {
			result.channels = await getActiveChannelsByIds(user.channels, {
				projections: CHANNEL_PROJECTIONS.NAME,
			});
		} else {
			result.channels = await getActiveChannels({
				projections: CHANNEL_PROJECTIONS.NAME,
			});
		}

		result.isOnline = onlineUsers.length > 0;

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
