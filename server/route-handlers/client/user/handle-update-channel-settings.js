const {
	USER_PROJECTIONS,

	updateChannelSettingsById,
} = require('../../../services/user');
const { NotFoundError } = require('ljit-error');
const { USER_NOT_FOUND } = require('../../../lib/error/code');

module.exports = async (req, res, next) => {
	try {
		const result = await updateChannelSettingsById(req.user._id, req.body, {
			projections: USER_PROJECTIONS.ID,
		});

		if (result === null) {
			return next(new NotFoundError(
				USER_NOT_FOUND.MESSAGE,
				USER_NOT_FOUND.CODE,
			));
		}

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};
