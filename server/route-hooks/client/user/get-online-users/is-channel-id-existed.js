const {
	CHANNEL_PROJECTIONS,

	getActiveChannelById,
} = require('../../../../services/channel');
const { NotFoundError } = require('ljit-error');
const { CHANNEL_NOT_FOUND } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { channelId } = req.query;

	if (channelId === undefined) {
		return next();
	}

	try {
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
};
