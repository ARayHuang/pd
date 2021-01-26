const { countActiveChannels } = require('../../../../services/channel');
const config = require('config');
const { ForbiddenError } = require('ljit-error');
const { CHANNEL_IS_EXCEEDED } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	try {
		const channelCount = await countActiveChannels();

		if (channelCount >= config.SERVER.CHANNEL.MAX) {
			throw new ForbiddenError(
				CHANNEL_IS_EXCEEDED.MESSAGE,
				CHANNEL_IS_EXCEEDED.CODE,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};
