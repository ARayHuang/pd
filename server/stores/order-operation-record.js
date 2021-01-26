const { ObjectId } = require('mongoose').Types;
const {
	create,
	find,
	aggregate,
	deleteMany,
} = require('../models/order-operation-record');
const {
	ENUM_ORDER_OPERATION_TYPE,
} = require('../lib/enum');
const CREATED_AT_PROJECTIONS = [
	'_id',
	'createdAt',
];

/**
 * @param {ObjectId|string} orderId
 * @param {ObjectId|string} userId
 * @param {string} type
 * @returns {OrderOperationRecordModel}
 */
function createOrderOperationRecord({ orderId, userId, type }) {
	return create({
		orderId,
		type,
		operatorId: userId,
	})
		.exec({ lean: false });
}

/**
 * @param {ObjectId} myUserId
 * @param {ObjectId} orderId
 * @param {Array<string>} projections
 * @returns {Promise<OrderOperationRecordModel|null>}
 */
async function getMyLastOrderOperationRecordByMyIdAndOrderId(myUserId, orderId, {
	projections,
} = {}) {
	try {
		const orderOperationRecords = await find(
			{
				orderId: orderId,
				operatorId: myUserId,
			},
			projections,
		)
			.exec({
				sort: { createdAt: -1 },
				limit: 1,
				lean: false,
			});

		return orderOperationRecords[0] || null;
	} catch (error) {
		throw error;
	}
}

/**
 * @param {ObjectId} myUserId
 * @param {ObjectId} orderId
 * @param {Array<string>} projections
 * @returns {Promise<OrderOperationRecordModel|null>}
 */
async function getOthersLastOrderOperationRecordByMyIdAndOrderId(myUserId, orderId, {
	projections,
} = {}) {
	try {
		const orderOperationRecords = await find(
			{
				orderId: orderId,
				operatorId: { $ne: myUserId },
				type: {
					$nin: [
						ENUM_ORDER_OPERATION_TYPE.READ_ORDER,
						ENUM_ORDER_OPERATION_TYPE.SUBSCRIBED_ORDER,
					],
				},
			},
			projections,
		)
			.exec({
				sort: { createdAt: -1 },
				limit: 1,
				lean: false,
			});

		return orderOperationRecords[0] || null;
	} catch (error) {
		throw error;
	}
}

/**
 * @param {ObjectId|string} orderId
 * @param {Array<string>} types
 * @param {ObjectId|string} excludedUserId
 * @returns {Promise<Array<Object>>}
 */
async function getLastRecordOfEachUserByOrderId(orderId, {
	types,
	excludedUserId,
} = {}) {
	try {
		const match = {
			orderId: new ObjectId(orderId),
		};

		if (types) {
			match.type = { $in: types };
		}

		if (excludedUserId) {
			match.operatorId = { $ne: new ObjectId(excludedUserId) };
		}

		const aggregateLayers = [
			{ $match: match },
			{ $sort: { createdAt: -1 } },
			{
				$group: {
					_id: '$operatorId',
					orderOperationRecord: { $first: '$$ROOT' },
				},
			},
		];
		const result = await aggregate(aggregateLayers).exec();

		return result.map(x => x.orderOperationRecord);
	} catch (error) {
		throw error;
	}
}

async function deleteOrderOperationRecordWithinOperatorIdsAndOrderId(operatorIds, orderId) {
	return deleteMany({
		orderId,
		operatorId: { $in: operatorIds },
	})
		.exec({ lean: false });
}

module.exports = {
	createOrderOperationRecord,
	getMyLastOrderOperationRecordByMyIdAndOrderId,
	getOthersLastOrderOperationRecordByMyIdAndOrderId,
	getLastRecordOfEachUserByOrderId,
	deleteOrderOperationRecordWithinOperatorIdsAndOrderId,

	CREATED_AT_PROJECTIONS,
};
