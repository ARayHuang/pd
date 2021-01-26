const {
	ORDER_PROJECTIONS,

	getOrderById,
} = require('../../../../services/order');
const { NotFoundError } = require('ljit-error');
const { ORDER_NOT_FOUND } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;

	try {
		const order = await getOrderById(orderId, {
			projections: ORDER_PROJECTIONS.ID,
		});

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};
