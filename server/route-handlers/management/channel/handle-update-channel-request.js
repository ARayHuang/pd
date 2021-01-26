const {
	CHANNEL_PROJECTIONS,

	updateActiveChannelById,
} = require('../../../services/channel');
const {
	NotFoundError,
	ConflictError,
} = require('ljit-error');
const {
	CHANNEL_NOT_FOUND,
	CHANNEL_DUPLICATED,
} = require('../../../lib/error/code');
const {
	publisher: { publishUpdatedChannel },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { channelId } = req.params;
	const { name } = req.body;

	try {
		const result = await updateActiveChannelById(channelId, {
			name,
		}, {
			projections: CHANNEL_PROJECTIONS.NAME,
		});

		if (result === null) {
			throw new NotFoundError(
				CHANNEL_NOT_FOUND.MESSAGE,
				CHANNEL_NOT_FOUND.CODE,
			);
		}

		publishUpdatedChannel(result.toJSON());
		res.status(204).end();
	} catch (error) {
		if (error.code === 11000) {
			return next(new ConflictError(
				CHANNEL_DUPLICATED.MESSAGE,
				CHANNEL_DUPLICATED.CODE,
			));
		}

		next(error);
	}
};
