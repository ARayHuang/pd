const {
	CHANNEL_PROJECTIONS,

	getActiveChannelById,
} = require('../../../services/channel');
const { NotFoundError } = require('ljit-error');
const { CHANNEL_NOT_FOUND } = require('../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { channelId } = req.params;

	try {
		const result = await getActiveChannelById(channelId, {
			projections: CHANNEL_PROJECTIONS.NAME,
		});

		if (result === null) {
			throw new NotFoundError(
				CHANNEL_NOT_FOUND.MESSAGE,
				CHANNEL_NOT_FOUND.CODE,
			);
		}

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
