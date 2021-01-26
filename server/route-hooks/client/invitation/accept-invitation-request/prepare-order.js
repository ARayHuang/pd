const { getOrderById } = require('../../../../services/order');
const { NotFoundError } = require('ljit-error');
const { ORDER_NOT_FOUND } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { invitation } = res.locals;

	try {
		const order = await getOrderById(invitation.order);

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		res.locals.order = order;

		next();
	} catch (error) {
		next(error);
	}
};
