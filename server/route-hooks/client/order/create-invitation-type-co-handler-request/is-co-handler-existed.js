const { ConflictError } = require('ljit-error');
const { ORDER_CO_HANDLER_DUPLICATED } = require('../../../../lib/error/code');

module.exports = (req, res, next) => {
	const { coHandler } = res.locals.order;

	if (coHandler !== undefined) {
		return next(new ConflictError(
			ORDER_CO_HANDLER_DUPLICATED.MESSAGE,
			ORDER_CO_HANDLER_DUPLICATED.CODE,
		));
	}

	next();
};
