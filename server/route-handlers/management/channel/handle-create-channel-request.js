const { pick } = require('lodash');
const {
	createChannel,
} = require('../../../services/channel');
const {
	ConflictError,
} = require('ljit-error');
const {
	CHANNEL_DUPLICATED,
} = require('../../../lib/error/code');
const {
	publisher: { publishCreatedChannel },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { name } = req.body;

	try {
		const channel = await createChannel(name);
		const result = pick(channel.toJSON(), ['id', 'name']);

		publishCreatedChannel(result);
		res.status(201).json(result);
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
