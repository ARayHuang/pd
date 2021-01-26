const {
	count,
	create,
	find,
	findOne,
	deleteOne,
} = require('../models/order-file');
const GET_ORDER_FILE_REQUEST_PROJECTIONS = [
	'_id',
	'type',
	'filename',
	'createdAt',
];
const MIN_PROJECTIONS = [
	'_id',
	'orderId',
	'user',
	'type',
	'filename',
];

/**
 * @param {ObjectId} id
 * @param {ObjectId|string} orderId
 * @param {ObjectId|string} userId
 * @param {string} type
 * @param {string} filename
 * @returns {OrderFileModel}
 */
function createOrderFile({ id, orderId, userId, type, filename }) {
	return create({
		_id: id,
		orderId,
		user: userId,
		type,
		filename,
	})
		.exec({ lean: false });
}

function getOrderFilesByOrderId(orderId, {
	projections,
} = {}) {
	return find(
		{ orderId },
		projections,
	)
		.exec({
			sort: { createdAt: 1 },
			lean: false,
		});
}

function countOrderFilesByOrderId(orderId) {
	return count({ orderId }).exec();
}

function getOrderFileByIdAndOrderId(id, orderId, {
	projections,
} = {}) {
	return findOne(
		{
			_id: id,
			orderId,
		},
		projections,
	)
		.exec({ lean: false });
}

function deleteOrderFileById(id) {
	return deleteOne(
		{
			_id: id,
		},
	)
		.exec({ lean: false });
}

module.exports = {
	createOrderFile,
	getOrderFilesByOrderId,
	countOrderFilesByOrderId,
	getOrderFileByIdAndOrderId,
	deleteOrderFileById,

	GET_ORDER_FILE_REQUEST_PROJECTIONS,
	MIN_PROJECTIONS,
};
