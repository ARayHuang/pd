const {
	create,
	aggregate,
	findOneAndJoin,
	findOneAndUpdate,
} = require('../models/order');
const {
	ENUM_ORDER_STATUS,
	ENUM_ORDER_OPERATION_TYPE,
} = require('../lib/enum');
const ObjectId = require('mongoose').Types.ObjectId;
const MongoMatchBuilder = require('../lib/mongo-query-builder/mongo-match-builder');
const MongoLookupBuilder = require('../lib/mongo-query-builder/mongo-lookup-builder');
const {
	getSkipByPageAndLimit,
} = require('./common');
const escapeStringRegexp = require('escape-string-regexp');
const OWNER_AND_HANDLER_PROJECTIONS = [
	'_id',
	'owner',
	'coOwner',
	'handler',
	'coHandler',
];
const OWNER_HANDLER_AND_CHANNEL_PROJECTIONS = [
	'_id',
	'owner',
	'coOwner',
	'handler',
	'coHandler',
	'channelId',
];
const GET_ORDER_REQUEST_PROJECTION = [
	'_id',
	'channelId',
	'owner',
	'coOwner',
	'handler',
	'coHandler',
	'customerName',
	'tags',
	'description',
	'status',
	'createdAt',
	'completedAt',
	'completedVia',
	'resolvedAt',
	'resolvedVia',
	'serialNumber',
];
const ID_ONLY_PROJECTIONS = [
	'_id',
];
const CREATE_ORDER_REQUEST_PROJECTIONS = [
	'_id',
	'channelId',
	'owner',
	'coOwner',
	'handler',
	'coHandler',
	'status',
];

/**
 * Convert order.myLastOperationRecord and order.othersLastOperationRecord to order.hasNewActivity.
 * @param {{myLastOperationRecord, othersLastOperationRecord}} order
 * @param {ObjectId|string} myUserId
 * @return {OrderModel}
 */
function appendHasNewActivityField(order, myUserId) {
	const {
		myLastOperationRecord,
		othersLastOperationRecord,
		owner,
		coOwner,
		handler,
		coHandler,
	} = order;

	if (
		(myLastOperationRecord || othersLastOperationRecord) &&
		[
			`${owner.id}`,
			`${coOwner && coOwner.id}`,
			`${handler && handler.id}`,
			`${coHandler && coHandler.id}`,
		].includes(`${myUserId}`)
	) {
		const myLastOperationTime = myLastOperationRecord ? myLastOperationRecord.createdAt : 0;
		const othersLastOperationTime = othersLastOperationRecord ? othersLastOperationRecord.createdAt : 0;

		order.hasNewActivity = myLastOperationTime < othersLastOperationTime;
	}

	delete order.myLastOperationRecord;
	delete order.othersLastOperationRecord;

	return order;
}

/**
 * @param {MongoLookupBuilder} builder
 * @param {ObjectId} myUserId
 * @param {string} myLastOperationRecordName
 * @param {string} othersLastOperationRecord
 * @returns {MongoLookupBuilder}
 */
function appendOrderOperationRecordLookup({ builder, myUserId, myLastOperationRecordName, othersLastOperationRecord }) {
	return builder
		.setLookup({
			from: 'order_operation_records',
			as: myLastOperationRecordName,
			let: { id: '$_id' },
			pipeline: [
				{
					$match: {
						$expr: { $eq: ['$$id', '$orderId'] },
						operatorId: myUserId,
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $limit: 1 },
			],
		})
		.setUnwind(myLastOperationRecordName, { preserveNullAndEmptyArrays: true })
		.setLookup({
			from: 'order_operation_records',
			as: othersLastOperationRecord,
			let: { id: '$_id' },
			pipeline: [
				{
					$match: {
						$expr: { $eq: ['$$id', '$orderId'] },
						operatorId: { $ne: myUserId },
						type: {
							$nin: [
								ENUM_ORDER_OPERATION_TYPE.READ_ORDER,
								ENUM_ORDER_OPERATION_TYPE.SUBSCRIBED_ORDER,
							],
						},
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $limit: 1 },
			],
		})
		.setUnwind(othersLastOperationRecord, { preserveNullAndEmptyArrays: true });
}

/**
 * @param {Object} args - Other fields.
 * @returns {{$project: Object}}
 */
function generateOrderProjectionLayer(args) {
	return {
		$project: {
			_id: 0,
			id: '$_id',
			myLastOperationRecord: '$myLastOperationRecord',
			othersLastOperationRecord: '$othersLastOperationRecord',
			tags: {
				$map: {
					input: '$tags',
					as: 'tag',
					in: {
						id: '$$tag._id',
						name: '$$tag.name',
						fontColor: '$$tag.fontColor',
						backgroundColor: '$$tag.backgroundColor',
					},
				},
			},
			customerName: '$customerName',
			description: '$description',
			status: '$status',
			createdAt: '$createdAt',
			completedAt: '$completedAt',
			completedVia: {
				$filter: {
					input: '$referenceUsers',
					as: 'users',
					cond: { $eq: ['$$users.id', '$completedVia'] },
				},
			},
			resolvedAt: '$resolvedAt',
			resolvedVia: {
				$filter: {
					input: '$referenceUsers',
					as: 'users',
					cond: { $eq: ['$$users.id', '$resolvedVia'] },
				},
			},
			owner: {
				$filter: {
					input: '$referenceUsers',
					as: 'users',
					cond: { $eq: ['$$users.id', '$owner'] },
				},
			},
			coOwner: {
				$filter: {
					input: '$referenceUsers',
					as: 'users',
					cond: { $eq: ['$$users.id', '$coOwner'] },
				},
			},
			handler: {
				$filter: {
					input: '$referenceUsers',
					as: 'users',
					cond: { $eq: ['$$users.id', '$handler'] },
				},
			},
			coHandler: {
				$filter: {
					input: '$referenceUsers',
					as: 'users',
					cond: { $eq: ['$$users.id', '$coHandler'] },
				},
			},
			serialNumber: '$serialNumber',
			...args,
		},
	};
}

function createOrder({
	channelId,
	owner,
	customerName,
	tags,
	description,
}) {
	return create({
		channelId,
		owner,
		customerName,
		tags,
		description,
		status: ENUM_ORDER_STATUS.CREATED,
	})
		.exec({ lean: false });
}

async function getOrdersWithinStatusAndPagination({ status, page }, {
	description,
	handlerId,
	customerName,
	channelIds,
	myUserId,
	channelName,
} = {}, {
	from,
	to,
	limit,
	sort,
	order,
} = {}) {
	const skip = getSkipByPageAndLimit(page, limit);
	const matchBuilder = new MongoMatchBuilder()
		.setEqual('description', description)
		.setGte('createdAt', from)
		.setLte('createdAt', to);

	if (customerName !== undefined) {
		matchBuilder.setRegex('customerName', new RegExp(escapeStringRegexp(customerName), 'i'));
	}

	if (status !== undefined) {
		matchBuilder.setIn('status', status);
	}

	if (handlerId !== undefined) {
		matchBuilder.setClause('$or', [
			{ handler: new ObjectId(handlerId) },
			{ coHandler: new ObjectId(handlerId) },
		]);
	}

	if (channelIds !== undefined) {
		matchBuilder.setIn('channelId', channelIds);
	}

	const match = matchBuilder.build();
	const lookupBuilder = new MongoLookupBuilder()
		.setLookup({
			from: 'users',
			as: 'referenceUsers',
			let: {
				ownerId: '$owner',
				coOwnerId: '$coOwner',
				handlerId: '$handler',
				coHandlerId: '$coHandler',
				completedViaId: '$completedVia',
				resolvedViaId: '$resolvedVia',
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$in: [
								'$_id',
								[
									'$$ownerId',
									'$$coOwnerId',
									'$$handlerId',
									'$$coHandlerId',
									'$$completedViaId',
									'$$resolvedViaId',
								],
							],
						},
					},
				},
				{
					$project: { _id: 0, id: '$_id', displayName: '$displayName' },
				},
			],
		})
		.setLookup({
			from: 'tags',
			localField: 'tags',
			foreignField: '_id',
			as: 'tags',
		})
		.setLookup({
			from: 'channels',
			localField: 'channelId',
			foreignField: '_id',
			as: 'channel',
		})
		.setUnwind('channel');
	const lookup = lookupBuilder.build();

	if (myUserId) {
		appendOrderOperationRecordLookup({
			builder: lookupBuilder,
			myUserId,
			myLastOperationRecordName: 'myLastOperationRecord',
			othersLastOperationRecord: 'othersLastOperationRecord',
		});
	}

	const aggregateLayers = [
		{ $match: match },
		...lookup,
		...(() => {
			const result = [];

			if (channelName) {
				result.push({
					$match: {
						'channel.name': {
							$regex: new RegExp(escapeStringRegexp(channelName), 'i'),
						},
					},
				});
			}

			return result;
		})(),
		{ $sort: { [sort]: order } },
		generateOrderProjectionLayer({
			channel: {
				id: '$channel._id',
				name: '$channel.name',
			},
		}),
		{ $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$coOwner', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$handler', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$coHandler', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$resolvedVia', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$completedVia', preserveNullAndEmptyArrays: true } },
		{
			$facet: {
				data: [
					{ $skip: skip },
					{ $limit: limit },
				],
				count: [{ $count: 'count' }],
			},
		},
	];
	const result = await aggregate(aggregateLayers).exec();
	const { data, count } = result[0];
	let numOfItems = 0;

	if (count.length) {
		numOfItems = count[0].count;
	}

	return {
		data: data.map(item => appendHasNewActivityField(item, myUserId)),
		numOfItems,
		numOfPages: Math.ceil(numOfItems / limit),
	};
}

async function getOrdersWithinStatusChannelIdAndPagination({ status, channelId, page }, {
	owner,
	handler,
	customerName,
	tags,
	myUserId,
	description,
} = {}, {
	from,
	to,
	sort,
	order,
	limit,
} = {}) {
	const skip = getSkipByPageAndLimit(page, limit);
	const matchBuilder = new MongoMatchBuilder()
		.setEqual('channelId', new ObjectId(channelId))
		.setEqual('description', description)
		.setGte('createdAt', from)
		.setLte('createdAt', to);

	if (customerName !== undefined) {
		matchBuilder.setRegex('customerName', new RegExp(escapeStringRegexp(customerName), 'i'));
	}

	if (status !== undefined) {
		matchBuilder.setIn('status', status);
	}

	if (tags !== undefined) {
		matchBuilder.setIn('tags', tags);
	}

	const match = matchBuilder.build();
	const lookupBuilder = new MongoLookupBuilder()
		.setLookup({
			from: 'users',
			as: 'referenceUsers',
			let: {
				ownerId: '$owner',
				coOwnerId: '$coOwner',
				handlerId: '$handler',
				coHandlerId: '$coHandler',
				completedViaId: '$completedVia',
				resolvedViaId: '$resolvedVia',
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$in: [
								'$_id',
								[
									'$$ownerId',
									'$$coOwnerId',
									'$$handlerId',
									'$$coHandlerId',
									'$$completedViaId',
									'$$resolvedViaId',
								],
							],
						},
					},
				},
				{
					$project: { _id: 0, id: '$_id', displayName: '$displayName' },
				},
			],
		})
		.setLookup({
			from: 'tags',
			localField: 'tags',
			foreignField: '_id',
			as: 'tags',
		});
	const lookupMatchBuilder = new MongoMatchBuilder();

	if (myUserId) {
		appendOrderOperationRecordLookup({
			builder: lookupBuilder,
			myUserId,
			myLastOperationRecordName: 'myLastOperationRecord',
			othersLastOperationRecord: 'othersLastOperationRecord',
		});
	}

	if (owner !== undefined) {
		lookupMatchBuilder.setRegex('owner.displayName', new RegExp(escapeStringRegexp(owner), 'i'));
	}

	if (handler !== undefined) {
		lookupMatchBuilder.setRegex('handler.displayName', new RegExp(escapeStringRegexp(handler), 'i'));
	}

	const lookup = lookupBuilder.build();
	const lookupMatch = lookupMatchBuilder.build();
	const aggregateLayers = [
		{ $match: match },
		...lookup,
		{ $match: lookupMatch },
		generateOrderProjectionLayer({
			channelId: '$channelId',
		}),
		{ $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$coOwner', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$handler', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$coHandler', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$resolvedVia', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$completedVia', preserveNullAndEmptyArrays: true } },
		{ $sort: { [sort]: order } },
		{
			$facet: {
				data: [
					{ $skip: skip },
					{ $limit: limit },
				],
				count: [{ $count: 'count' }],
			},
		},
	];
	const result = await aggregate(aggregateLayers).exec();
	const { data, count } = result[0];
	let numOfItems = 0;

	if (count.length) {
		numOfItems = count[0].count;
	}

	return {
		data: data.map(item => appendHasNewActivityField(item, myUserId)),
		numOfItems,
		numOfPages: Math.ceil(numOfItems / limit),
	};
}

function getOrderByIdAndChannelId(id, channelId, {
	projections,
} = {}) {
	const populateArgs = [
		{
			path: 'owner',
			select: 'displayName',
		},
		{
			path: 'coOwner',
			select: 'displayName',
		},
		{
			path: 'handler',
			select: 'displayName',
		},
		{
			path: 'coHandler',
			select: 'displayName',
		},
		{
			path: 'resolvedVia',
			select: 'displayName',
		},
		{
			path: 'completedVia',
			select: 'displayName',
		},
		{
			path: 'tags',
			select: [
				'name',
				'backgroundColor',
				'fontColor',
			],
		},
	];
	const criteria = {
		_id: id,
		channelId,
	};

	return findOneAndJoin(populateArgs, criteria, projections)
		.exec({ lean: false });
}

function getOrderById(id, {
	projections,
} = {}) {
	const populateArgs = [
		{
			path: 'owner',
			select: 'displayName',
		},
		{
			path: 'coOwner',
			select: 'displayName',
		},
		{
			path: 'handler',
			select: 'displayName',
		},
		{
			path: 'coHandler',
			select: 'displayName',
		},
		{
			path: 'resolvedVia',
			select: 'displayName',
		},
		{
			path: 'completedVia',
			select: 'displayName',
		},
		{
			path: 'tags',
			select: [
				'name',
				'backgroundColor',
				'fontColor',
			],
		},
	];
	const criteria = {
		_id: id,
	};

	return findOneAndJoin(populateArgs, criteria, projections)
		.exec({ lean: false });
}

function acceptOrderByIdAndChannelId(id, channelId, {
	handler,
}, {
	projections,
} = {}) {
	return findOneAndUpdate({
		_id: id,
		channelId,
		status: ENUM_ORDER_STATUS.CREATED,
	}, {
		$set: {
			status: ENUM_ORDER_STATUS.ACCEPTED,
			handler,
		},
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

function resolveOrderByIdChannelIdAndHandler(id, channelId, handler, {
	projections,
} = {}) {
	return findOneAndUpdate({
		_id: id,
		channelId,
		status: ENUM_ORDER_STATUS.ACCEPTED,
		$or: [
			{ handler },
			{ coHandler: handler },
		],
	}, {
		$set: {
			status: ENUM_ORDER_STATUS.RESOLVED,
			resolvedAt: new Date(),
			resolvedVia: handler,
		},
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

function trackOrderByIdChannelIAndOwner(id, channelId, owner, {
	projections,
} = {}) {
	return findOneAndUpdate({
		_id: id,
		channelId,
		status: ENUM_ORDER_STATUS.RESOLVED,
		$or: [
			{ owner },
			{ coOwner: owner },
		],
	}, {
		$set: {
			status: ENUM_ORDER_STATUS.TRACKED,
		},
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	}).exec({ lean: false });
}

function completeOrderByIdChannelIdAndOwner(id, channelId, owner, {
	projections,
} = {}) {
	return findOneAndUpdate({
		_id: id,
		channelId,
		status: { $in: [ENUM_ORDER_STATUS.TRACKED, ENUM_ORDER_STATUS.RESOLVED] },
		$or: [
			{ owner },
			{ coOwner: owner },
		],
	}, {
		$set: {
			status: ENUM_ORDER_STATUS.COMPLETED,
			completedAt: new Date(),
			completedVia: owner,
		},
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

function deleteOrderByIdChannelIdAndOwner(id, channelId, owner, {
	projections,
} = {}) {
	const allowStatus = [
		ENUM_ORDER_STATUS.CREATED,
		ENUM_ORDER_STATUS.ACCEPTED,
		ENUM_ORDER_STATUS.RESOLVED,
		ENUM_ORDER_STATUS.TRACKED,
	];

	return findOneAndUpdate({
		_id: id,
		channelId,
		status: { $in: allowStatus },
		$or: [
			{ owner },
			{ coOwner: owner },
		],
	}, {
		$set: {
			status: ENUM_ORDER_STATUS.DELETED,
		},
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

function createCoOwnerByIdOwnerAndCoOwner({ id, owner, coOwner }, {
	channelIds,
} = {}, {
	projections,
} = {}) {
	const filter = {
		_id: id,
		owner,
		coOwner: { $exists: false },
	};

	if (channelIds !== undefined) {
		filter.channelId = { $in: channelIds };
	}

	return findOneAndUpdate(filter, {
		$set: { coOwner },
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

function createCoHandlerByIdOwnerAndCoHandler({ id, handler, coHandler }, {
	channelIds,
} = {}, {
	projections,
} = {}) {
	const filter = {
		_id: id,
		handler,
		coHandler: { $exists: false },
	};

	if (channelIds !== undefined) {
		filter.channelId = { $in: channelIds };
	}

	return findOneAndUpdate(filter, {
		$set: { coHandler },
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	}).exec({ lean: false });
}

function transferOwnerByIdPreviousOwnerAndOwner({ id, previousOwner, owner }, {
	channelIds,
} = {}, {
	projections,
} = {}) {
	const filter = {
		$or: [
			{ owner: previousOwner },
			{ coOwner: previousOwner },
		],
		_id: id,
	};

	if (channelIds !== undefined) {
		filter.channelId = { $in: channelIds };
	}

	return findOneAndUpdate(filter, {
		$set: { owner },
		$inc: { __v: 1 },
		$unset: { coOwner: 1 },
	}, {
		new: true,
		fields: projections,
	}).exec({ lean: false });
}

function transferHandlerByIdPreviousHandlerAndHandler({ id, previousHandler, handler }, {
	channelIds,
} = {}, {
	projections,
} = {}) {
	const filter = {
		$or: [
			{ handler: previousHandler },
			{ coHandler: previousHandler },
		],
		_id: id,
	};

	if (channelIds !== undefined) {
		filter.channelId = { $in: channelIds };
	}

	return findOneAndUpdate(filter, {
		$set: { handler },
		$inc: { __v: 1 },
		$unset: { coHandler: 1 },
	}, {
		new: true,
		fields: projections,
	}).exec({ lean: false });
}

function getOrderAndChannelById(id, {
	channelIds,
	projections,
} = {}) {
	const populateArgs = [
		{
			path: 'owner',
			select: 'displayName',
		},
		{
			path: 'coOwner',
			select: 'displayName',
		},
		{
			path: 'handler',
			select: 'displayName',
		},
		{
			path: 'coHandler',
			select: 'displayName',
		},
		{
			path: 'resolvedVia',
			select: 'displayName',
		},
		{
			path: 'completedVia',
			select: 'displayName',
		},
		{
			path: 'tags',
			select: [
				'name',
				'backgroundColor',
				'fontColor',
			],
		},
		{
			path: 'channelId',
			select: 'name',
		},
	];
	const criteria = {
		_id: id,
	};

	if (channelIds !== undefined) {
		criteria.channelId = { $in: channelIds };
	}

	return findOneAndJoin(populateArgs, criteria, projections)
		.exec({ lean: false });
}

function updateDescriptionById(id, description, {
	channelIds,
	projections,
} = {}) {
	const filter = {
		_id: id,
	};

	if (channelIds !== undefined) {
		filter.channelId = { $in: channelIds };
	}

	return findOneAndUpdate(filter, {
		description,
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

module.exports = {
	createOrder,
	getOrdersWithinStatusChannelIdAndPagination,
	getOrdersWithinStatusAndPagination,
	getOrderByIdAndChannelId,
	getOrderById,
	deleteOrderByIdChannelIdAndOwner,
	completeOrderByIdChannelIdAndOwner,
	trackOrderByIdChannelIAndOwner,
	acceptOrderByIdAndChannelId,
	resolveOrderByIdChannelIdAndHandler,
	createCoOwnerByIdOwnerAndCoOwner,
	createCoHandlerByIdOwnerAndCoHandler,
	transferOwnerByIdPreviousOwnerAndOwner,
	transferHandlerByIdPreviousHandlerAndHandler,
	getOrderAndChannelById,
	updateDescriptionById,

	OWNER_AND_HANDLER_PROJECTIONS,
	OWNER_HANDLER_AND_CHANNEL_PROJECTIONS,
	GET_ORDER_REQUEST_PROJECTION,
	ID_ONLY_PROJECTIONS,
	CREATE_ORDER_REQUEST_PROJECTIONS,
};
