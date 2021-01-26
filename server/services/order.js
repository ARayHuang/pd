const OrderStore = require('../stores/order');
const OrderOperationRecordStore = require('../stores/order-operation-record');
const { NotFoundError } = require('ljit-error');
const { ORDER_NOT_FOUND } = require('../lib/error/code');

function populateOrderReferenceFields(order) {
	return order
		.populate({ path: 'owner', select: 'displayName' })
		.populate({ path: 'coOwner', select: 'displayName' })
		.populate({ path: 'handler', select: 'displayName' })
		.populate({ path: 'coHandler', select: 'displayName' })
		.populate({ path: 'resolvedVia', select: 'displayName' })
		.populate({ path: 'completedVia', select: 'displayName' })
		.populate({ path: 'tags', select: ['name', 'backgroundColor', 'fontColor'] })
		.populate({ path: 'channelId', select: 'name' });
}

async function getOrderChannelAndHasNewActivityByIdChannelIdsAndMyUserId({ id, channelIds, myUserId }, {
	projections,
} = {}) {
	try {
		const order = await OrderStore.getOrderAndChannelById(id, {
			channelIds,
			projections,
		});

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		const {
			owner,
			coOwner,
			handler,
			coHandler,
		} = order;

		if (
			myUserId &&
			[
				owner.id,
				coOwner && coOwner.id,
				handler && handler.id,
				coHandler && coHandler.id,
			].includes(`${myUserId}`)
		) {
			const [myLastOrderOperationRecord, othersLastOrderOperationRecord] = await Promise.all([
				OrderOperationRecordStore.getMyLastOrderOperationRecordByMyIdAndOrderId(
					myUserId,
					order._id,
					{ projections: OrderOperationRecordStore.CREATED_AT_PROJECTIONS },
				),
				OrderOperationRecordStore.getOthersLastOrderOperationRecordByMyIdAndOrderId(
					myUserId,
					order._id,
					{ projections: OrderOperationRecordStore.CREATED_AT_PROJECTIONS },
				),
			]);

			if (myLastOrderOperationRecord || othersLastOrderOperationRecord) {
				const myLastOperationTime = myLastOrderOperationRecord ? myLastOrderOperationRecord.createdAt : 0;
				const othersLastOperationTime = othersLastOrderOperationRecord ? othersLastOrderOperationRecord.createdAt : 0;

				order.hasNewActivity = myLastOperationTime < othersLastOperationTime;
			}
		}

		return order;
	} catch (error) {
		throw error;
	}
}

async function updateDescriptionById(id, description, { channelIds } = {}) {
	const order = await OrderStore.updateDescriptionById(id, description, {
		channelIds,
		projections: OrderStore.GET_ORDER_REQUEST_PROJECTION,
	});

	if (order === null) {
		throw new NotFoundError(
			ORDER_NOT_FOUND.MESSAGE,
			ORDER_NOT_FOUND.CODE,
		);
	}

	await populateOrderReferenceFields(order).execPopulate();

	return order;
}

async function createOrder({
	channelId,
	owner,
	customerName,
	tags,
	description,
}) {
	try {
		const order = await OrderStore.createOrder({
			channelId,
			owner,
			customerName,
			tags,
			description,
		});

		await order.populate({ path: 'channelId', select: 'name' }).execPopulate();
		return order;
	} catch (error) {
		throw error;
	}
}

async function acceptOrderByIdAndChannelId(id, channelId, { handler }) {
	try {
		const order = await OrderStore.acceptOrderByIdAndChannelId(
			id,
			channelId,
			{ handler },
			{ projections: OrderStore.GET_ORDER_REQUEST_PROJECTION },
		);

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		await populateOrderReferenceFields(order).execPopulate();

		return order;
	} catch (error) {
		throw error;
	}
}

async function completeOrderByIdChannelIdAndOwner(id, channelId, owner) {
	try {
		const order = await OrderStore.completeOrderByIdChannelIdAndOwner(
			id,
			channelId,
			owner,
			{ projections: OrderStore.GET_ORDER_REQUEST_PROJECTION },
		);

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		await populateOrderReferenceFields(order).execPopulate();

		return order;
	} catch (error) {
		throw error;
	}
}

async function deleteOrderByIdChannelIdAndOwner(id, channelId, owner) {
	try {
		const order = await OrderStore.deleteOrderByIdChannelIdAndOwner(
			id,
			channelId,
			owner,
			{ projections: OrderStore.GET_ORDER_REQUEST_PROJECTION },
		);

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		await populateOrderReferenceFields(order).execPopulate();
		return order;
	} catch (error) {
		throw error;
	}
}

async function resolveOrderByIdChannelIdAndHandler(id, channelId, handler) {
	try {
		const order = await OrderStore.resolveOrderByIdChannelIdAndHandler(
			id,
			channelId,
			handler,
			{ projections: OrderStore.GET_ORDER_REQUEST_PROJECTION },
		);

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		await populateOrderReferenceFields(order).execPopulate();
		return order;
	} catch (error) {
		throw error;
	}
}

async function trackOrderByIdChannelIAndOwner(id, channelId, owner) {
	try {
		const order = await OrderStore.trackOrderByIdChannelIAndOwner(
			id,
			channelId,
			owner,
			{ projections: OrderStore.GET_ORDER_REQUEST_PROJECTION },
		);

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		await populateOrderReferenceFields(order).execPopulate();
		return order;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createOrder,
	getOrdersWithinStatusChannelIdAndPagination: OrderStore.getOrdersWithinStatusChannelIdAndPagination,
	getOrderByIdAndChannelId: OrderStore.getOrderByIdAndChannelId,
	getOrderById: OrderStore.getOrderById,
	getOrderChannelAndHasNewActivityByIdChannelIdsAndMyUserId,
	deleteOrderByIdChannelIdAndOwner,
	completeOrderByIdChannelIdAndOwner,
	trackOrderByIdChannelIAndOwner,
	acceptOrderByIdAndChannelId,
	resolveOrderByIdChannelIdAndHandler,
	getOrdersWithinStatusAndPagination: OrderStore.getOrdersWithinStatusAndPagination,
	createCoOwnerByIdOwnerAndCoOwner: OrderStore.createCoOwnerByIdOwnerAndCoOwner,
	createCoHandlerByIdOwnerAndCoHandler: OrderStore.createCoHandlerByIdOwnerAndCoHandler,
	transferOwnerByIdPreviousOwnerAndOwner: OrderStore.transferOwnerByIdPreviousOwnerAndOwner,
	transferHandlerByIdPreviousHandlerAndHandler: OrderStore.transferHandlerByIdPreviousHandlerAndHandler,
	getOrderAndChannelById: OrderStore.getOrderAndChannelById,
	updateDescriptionById,

	ORDER_PROJECTIONS: {
		ORDER: OrderStore.GET_ORDER_REQUEST_PROJECTION,
		OWNER_AND_HANDLER: OrderStore.OWNER_AND_HANDLER_PROJECTIONS,
		OWNER_HANDLER_AND_CHANNEL: OrderStore.OWNER_HANDLER_AND_CHANNEL_PROJECTIONS,
		ID: OrderStore.ID_ONLY_PROJECTIONS,
		CREATE: OrderStore.CREATE_ORDER_REQUEST_PROJECTIONS,
	},
};
