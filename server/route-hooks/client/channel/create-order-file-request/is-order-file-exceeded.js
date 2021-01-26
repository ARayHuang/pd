const config = require('config');
const { countOrderFilesByOrderId } = require('../../../../services/order-file');
const { ForbiddenError } = require('ljit-error');
const { ORDER_FILE_IS_EXCEEDED } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;

	try {
		const orderFileCount = await countOrderFilesByOrderId(orderId);

		if (orderFileCount >= config.SERVER.ORDER_FILE.MAX) {
			throw new ForbiddenError(
				ORDER_FILE_IS_EXCEEDED.MESSAGE,
				ORDER_FILE_IS_EXCEEDED.CODE,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};
