const {
	NotFoundError,
} = require('ljit-error');
const {
	CHANNEL_NOT_FOUND,
} = require('../lib/error/code');
const {
	ENUM_USER_TYPE,
} = require('../lib/enum');
const {
	getActiveChannelById,

	CHANNEL_PROJECTIONS,
} = require('../services/channel');

function validateUserChannelIfTypeIsStaff(req, res, next) {
	if (req.user.type !== ENUM_USER_TYPE.STAFF) {
		return next();
	}

	const { channelId } = req.params;
	const { channels } = req.user;

	if (channels.indexOf(channelId) < 0) {
		return next(new NotFoundError(
			CHANNEL_NOT_FOUND.MESSAGE,
			CHANNEL_NOT_FOUND.CODE,
		));
	}

	next();
}

async function isChannelExisted(req, res, next) {
	try {
		const { channelId } = req.params;
		const channel = await getActiveChannelById(channelId, {
			projections: CHANNEL_PROJECTIONS.ID,
		});

		if (channel === null) {
			throw new NotFoundError(
				CHANNEL_NOT_FOUND.MESSAGE,
				CHANNEL_NOT_FOUND.CODE,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
}

module.exports = {
	validateUserChannelIfTypeIsStaff,
	isChannelExisted,
};
