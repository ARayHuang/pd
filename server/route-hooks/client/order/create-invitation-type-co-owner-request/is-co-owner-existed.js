const { ConflictError } = require('ljit-error');
const { ORDER_CO_OWNER_DUPLICATED } = require('../../../../lib/error/code');

module.exports = (req, res, next) => {
	const { coOwner } = res.locals.order;

	if (coOwner !== undefined) {
		return next(new ConflictError(
			ORDER_CO_OWNER_DUPLICATED.MESSAGE,
			ORDER_CO_OWNER_DUPLICATED.CODE,
		));
	}

	next();
};
