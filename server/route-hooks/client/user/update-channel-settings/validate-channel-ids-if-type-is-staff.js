const { ENUM_USER_TYPE } = require('../../../../lib/enum');
const { CHANNEL_NOT_FOUND } = require('../../../../lib/error/code');
const { NotFoundError } = require('ljit-error');

module.exports = (req, res, next) => {
	if (req.user.type !== ENUM_USER_TYPE.STAFF) {
		return next();
	}

	const channelIds = req.user.channels.map(x => `${x}`);
	const invalidChannelIds = req.body.filter(x => !channelIds.includes(x.id));

	if (invalidChannelIds.length !== 0) {
		return next(new NotFoundError(
			CHANNEL_NOT_FOUND.MESSAGE,
			CHANNEL_NOT_FOUND.CODE,
		));
	}

	next();
};
