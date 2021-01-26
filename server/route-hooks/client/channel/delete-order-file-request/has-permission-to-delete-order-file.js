const { ForbiddenError } = require('ljit-error');
const { USER_IS_FORBIDDEN } = require('../../../../lib/error/code');

module.exports = (req, res, next) => {
	const { orderFile } = res.locals;

	if (req.user.equals(orderFile.user)) {
		return next();
	}

	next(new ForbiddenError(
		USER_IS_FORBIDDEN.MESSAGE,
		USER_IS_FORBIDDEN.CODE,
	));
};
