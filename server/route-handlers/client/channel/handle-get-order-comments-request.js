const {
	ORDER_COMMENT_PROJECTIONS,

	getOrderCommentsByOrderId,
} = require('../../../services/order-comment');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;

	try {
		const result = await getOrderCommentsByOrderId(orderId, {
			projections: ORDER_COMMENT_PROJECTIONS.GET_ORDER_COMMENT,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
