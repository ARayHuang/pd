const {
	findAndJoin,
	create,
	count,
} = require('../models/order-comment');
const GET_ORDER_COMMENTS_REQUEST_PROJECTIONS = [
	'_id',
	'user',
	'content',
	'createdAt',
];

function createOrderComment(rows) {
	return create(rows)
		.exec({ lean: false });
}

function getOrderCommentsByOrderId(orderId, {
	projections,
} = {}) {
	const populateArgs = [
		{
			path: 'user',
			select: [
				'displayName',
				'profilePictureId',
			],
		},
	];
	const criteria = {
		orderId,
	};

	return findAndJoin(populateArgs, criteria, projections)
		.exec({
			lean: false,
			sort: { createdAt: 1 },
		});
}

function countOrderCommentsByOrderId(orderId) {
	return count({ orderId }).exec();
}

module.exports = {
	createOrderComment,
	getOrderCommentsByOrderId,
	countOrderCommentsByOrderId,

	GET_ORDER_COMMENTS_REQUEST_PROJECTIONS,
};
