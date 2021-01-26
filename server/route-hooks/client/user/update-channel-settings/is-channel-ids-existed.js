const {
	CHANNEL_PROJECTIONS,

	getActiveChannelsByIds,
} = require('../../../../services/channel');
const { NotFoundError } = require('ljit-error');
const { CHANNEL_NOT_FOUND } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const channelIds = req.body.map(x => x.id);

	try {
		const channels = await getActiveChannelsByIds(channelIds, {
			projections: CHANNEL_PROJECTIONS.ID,
		});

		if (channels.length !== channelIds.length) {
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
