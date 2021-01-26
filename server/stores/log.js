const {
	create,
	findAndJoin,
	count,
} = require('../models/log');
const { getSkipByPageAndLimit } = require('./common');
const GET_LOG_PROJECTIONS = [
	'_id',
	'operator',
	'type',
	'associateUser',
	'createdAt',
	'details',
];

/**
 * @param {{
 * 		operator: ObjectId,
 * 		type: string,
 * 		orderId: ObjectId,
 * 		associateUser: ObjectId,
 * }} rows
 * @returns {LogModel}
 */
function createLog({ operator, type, orderId, associateUser, details }) {
	return create({
		operator,
		type,
		orderId,
		associateUser,
		details,
	}).exec({ lean: false });
}

function getLogsByOrderIdAndPagination(orderId, page, {
	limit,
	order,
	sort,
	projections,
} = {}) {
	const skip = getSkipByPageAndLimit(page, limit);
	const populateArgs = [
		{
			path: 'operator',
			select: [
				'displayName',
			],
		},
		{
			path: 'associateUser',
			select: [
				'displayName',
			],
		},
	];
	const criteria = {
		orderId,
	};

	return findAndJoin(populateArgs, criteria, projections)
		.exec({
			lean: false,
			sort: {
				[sort]: order,
			},
			skip,
			limit,
		});
}

function countLogsByOrderId(orderId) {
	return count({ orderId }).exec();
}

module.exports = {
	createLog,
	getLogsByOrderIdAndPagination,
	countLogsByOrderId,

	GET_LOG_PROJECTIONS,
};
