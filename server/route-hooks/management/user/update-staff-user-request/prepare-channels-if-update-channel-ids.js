const {
	CHANNEL_PROJECTIONS,

	getActiveChannelsByIds,
} = require('../../../../services/channel');

module.exports = async (req, res, next) => {
	const { channelIds } = req.body;

	if (channelIds === undefined) {
		return next();
	}

	try {
		res.locals.channels = await getActiveChannelsByIds(channelIds, {
			projections: CHANNEL_PROJECTIONS.NAME,
		});
		next();
	} catch (error) {
		next(error);
	}
};
