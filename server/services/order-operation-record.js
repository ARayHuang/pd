const {
	ENUM_ORDER_OPERATION_TYPE,
} = require('../lib/enum');
const OrderOperationRecordStore = require('../stores/order-operation-record');
const {
	getLastRecordOfEachUserByOrderId,
} = require('../stores/order-operation-record');
const {
	getOrderById,

	GET_ORDER_REQUEST_PROJECTION,
} = require('../stores/order');
const {
	getActiveChannelById,

	NAME_ONLY_PROJECTIONS,
} = require('../stores/channel');
const {
	publisher: { publishNewActivityOrder },
} = require('../lib/socket');

async function createOrderOperationRecord({ orderId, userId, type }) {
	try {
		const NEW_ACTIVITY_TYPES = [
			ENUM_ORDER_OPERATION_TYPE.CREATED_COMMENT,
			ENUM_ORDER_OPERATION_TYPE.CREATED_FILE,
			ENUM_ORDER_OPERATION_TYPE.UPDATED_DESCRIPTION,
		];
		const broadcastUserIds = [];

		if (NEW_ACTIVITY_TYPES.includes(type)) {
			const [
				lastRecordOfEachUser,
				newActivityRecordOfEachUser,
			] = await Promise.all([
				getLastRecordOfEachUserByOrderId(orderId, { excludedUserId: userId }),
				getLastRecordOfEachUserByOrderId(orderId, {
					types: [
						ENUM_ORDER_OPERATION_TYPE.CREATED_COMMENT,
						ENUM_ORDER_OPERATION_TYPE.CREATED_FILE,
						ENUM_ORDER_OPERATION_TYPE.UPDATED_DESCRIPTION,
					],
				}),
			]);

			lastRecordOfEachUser.forEach(lastRecord => {
				let othersLastRecord;

				for (let index = 0; index < newActivityRecordOfEachUser.length; index++) {
					const newActivityRecord = newActivityRecordOfEachUser[index];

					if (`${lastRecord.operatorId}` !== `${newActivityRecord.operatorId}`) {
						if (!othersLastRecord || othersLastRecord.createdAt < newActivityRecord.createdAt) {
							othersLastRecord = newActivityRecord;
						}
					}
				}

				if (!othersLastRecord || lastRecord.createdAt > othersLastRecord.createdAt) {
					broadcastUserIds.push(lastRecord.operatorId);
				}
			});
		}

		const orderOperationRecord = await OrderOperationRecordStore.createOrderOperationRecord({ orderId, userId, type });

		if (broadcastUserIds.length) {
			const order = await getOrderById(orderId, {
				projections: GET_ORDER_REQUEST_PROJECTION,
			});
			const channel = await getActiveChannelById(order.channelId, {
				projections: NAME_ONLY_PROJECTIONS,
			});

			publishNewActivityOrder({
				userIds: broadcastUserIds,
				order: {
					...order.toJSON(),
					channel: channel.toJSON(),
					channelId: undefined,
					hasNewActivity: true,
				},
			});
		}

		return orderOperationRecord;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createOrderOperationRecord,
	deleteOrderOperationRecordWithinOperatorIdsAndOrderId: OrderOperationRecordStore.deleteOrderOperationRecordWithinOperatorIdsAndOrderId,
};
