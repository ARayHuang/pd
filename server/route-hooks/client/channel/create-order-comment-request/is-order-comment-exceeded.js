const config = require('config');
const { countOrderCommentsByOrderId } = require('../../../../services/order-comment');
const { ForbiddenError } = require('ljit-error');
const { ORDER_COMMENT_IS_EXCEEDED } = require('../../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;

	try {
		const orderCommentCount = await countOrderCommentsByOrderId(orderId);

		if (orderCommentCount >= config.SERVER.ORDER_COMMENT.MAX) {
			throw new ForbiddenError(
				ORDER_COMMENT_IS_EXCEEDED.MESSAGE,
				ORDER_COMMENT_IS_EXCEEDED.CODE,
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};
