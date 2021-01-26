const OrderCommentStore = require('../stores/order-comment');

module.exports = {
	createOrderComment: OrderCommentStore.createOrderComment,
	getOrderCommentsByOrderId: OrderCommentStore.getOrderCommentsByOrderId,
	countOrderCommentsByOrderId: OrderCommentStore.countOrderCommentsByOrderId,

	ORDER_COMMENT_PROJECTIONS: {
		GET_ORDER_COMMENT: OrderCommentStore.GET_ORDER_COMMENTS_REQUEST_PROJECTIONS,
	},
};
