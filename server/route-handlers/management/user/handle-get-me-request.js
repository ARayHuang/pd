const { pick } = require('lodash');
const {
	getActiveChannels,

	CHANNEL_PROJECTIONS,
} = require('../../../services/channel');

module.exports = async (req, res, next) => {
	try {
		const result = pick(req.user.toJSON(), [
			'id',
			'username',
			'displayName',
			'type',
			'departmentType',
			'shiftType',
			'profilePictureId',
			'hasPermissionToAddStaff',
		]);

		result.channels = await getActiveChannels({
			projections: CHANNEL_PROJECTIONS.NAME,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
