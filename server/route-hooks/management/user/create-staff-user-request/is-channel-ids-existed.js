const {
	NotFoundError,
} = require('ljit-error');
const {
	CHANNEL_NOT_FOUND,
} = require('../../../../lib/error/code');
const {
	getActiveChannelsByIds,

	CHANNEL_PROJECTIONS,
} = require('../../../../services/channel');

module.exports = async (req, res, next) => {
	const { channelIds } = req.body;

	try {
		const channels = await getActiveChannelsByIds(channelIds, {
			projections: CHANNEL_PROJECTIONS.ID,
		});

		if (channels.length !== channelIds.length) {
			const error = new NotFoundError(
				CHANNEL_NOT_FOUND.MESSAGE,
				CHANNEL_NOT_FOUND.CODE,
			);

			return next(error);
		}
	} catch (error) {
		return next(error);
	}

	next();
};
