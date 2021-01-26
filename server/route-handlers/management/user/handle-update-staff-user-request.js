const {
	USER_PROJECTIONS,

	updateStaffUserById,
} = require('../../../services/user');
const { NotFoundError } = require('ljit-error');
const { USER_NOT_FOUND } = require('../../../lib/error/code');
const {
	publisher: { publishUpdatedUserChannels },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { userId } = req.params;
	const {
		profilePictureId, displayName, password,
		shiftType, channelIds,
	} = req.body;

	try {
		const result = await updateStaffUserById(userId, {
			profilePictureId,
			displayName,
			password,
			shiftType,
			channelIds,
		}, {
			projections: USER_PROJECTIONS.ID,
		});

		if (result === null) {
			throw new NotFoundError(
				USER_NOT_FOUND.MESSAGE,
				USER_NOT_FOUND.CODE,
			);
		}

		if (channelIds) {
			publishUpdatedUserChannels({
				userId,
				channels: res.locals.channels,
			});
		}

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};
