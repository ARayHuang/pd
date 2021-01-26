const { pick } = require('lodash');
const {
	CHANNEL_PROJECTIONS,

	getActiveChannels,
	getActiveChannelsByIds,
} = require('../../../services/channel');
const { ENUM_USER_TYPE } = require('../../../lib/enum');

module.exports = async (req, res, next) => {
	const { channels } = req.user;

	try {
		const result = pick(req.user.toJSON(), [
			'id',
			'username',
			'displayName',
			'type',
			'departmentType',
			'shiftType',
			'profilePictureId',
			'channelSettings',
		]);

		if (result.type === ENUM_USER_TYPE.STAFF) {
			result.channels = await getActiveChannelsByIds(channels, {
				projections: CHANNEL_PROJECTIONS.NAME,
			});
		} else {
			result.channels = await getActiveChannels({
				projections: CHANNEL_PROJECTIONS.NAME,
			});
		}

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
