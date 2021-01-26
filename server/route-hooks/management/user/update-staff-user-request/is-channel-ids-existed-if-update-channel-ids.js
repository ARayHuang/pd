const { NotFoundError } = require('ljit-error');
const { CHANNEL_NOT_FOUND } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { channelIds } = req.body;

	if (channelIds === undefined) {
		return next();
	}

	try {
		const { channels } = res.locals;

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
