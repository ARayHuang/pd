const {
	CHANNEL_PROJECTIONS,

	deleteActiveChannelById,
} = require('../../../services/channel');
const { NotFoundError } = require('ljit-error');
const { CHANNEL_NOT_FOUND } = require('../../../lib/error/code');
const {
	publisher: { publishDeletedChannel },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { channelId } = req.params;

	try {
		const result = await deleteActiveChannelById(channelId, {
			projections: CHANNEL_PROJECTIONS.ID,
		});

		if (result === null) {
			throw new NotFoundError(
				CHANNEL_NOT_FOUND.MESSAGE,
				CHANNEL_NOT_FOUND.CODE,
			);
		}

		publishDeletedChannel(channelId);
		res.status(204).end();
	} catch (error) {
		next(error);
	}
};
