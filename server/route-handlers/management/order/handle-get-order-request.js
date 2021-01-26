const {
	ORDER_PROJECTIONS,

	getOrderAndChannelById,
} = require('../../../services/order');
const {
	ORDER_FILE_PROJECTIONS,

	getOrderFilesByOrderId,
} = require('../../../services/order-file');
const { NotFoundError } = require('ljit-error');
const { ORDER_NOT_FOUND } = require('../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;

	try {
		const order = await getOrderAndChannelById(orderId, {
			projections: ORDER_PROJECTIONS.ORDER,
		});

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		const result = order.toJSON();

		result.files = await getOrderFilesByOrderId(orderId, {
			projections: ORDER_FILE_PROJECTIONS.ORDER_FILE,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
