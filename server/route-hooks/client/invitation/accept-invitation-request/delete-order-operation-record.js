const { deleteOrderOperationRecordWithinOperatorIdsAndOrderId } = require('../../../../services/order-operation-record');
const { ENUM_INVITATION_TYPE } = require('../../../../lib/enum');

module.exports = async (req, res, next) => {
	const operatorIds = [];
	const { order, invitation } = res.locals;

	switch (res.locals.invitation.type) {
		case ENUM_INVITATION_TYPE.TRANSFERRED_OWNER:
			operatorIds.push(order.owner._id);

			if (order.coOwner) {
				operatorIds.push(order.coOwner._id);
			}

			break;
		case ENUM_INVITATION_TYPE.TRANSFERRED_HANDLER:
			operatorIds.push(order.handler._id);

			if (order.coHandler) {
				operatorIds.push(order.coHandler._id);
			}

			break;
		default:
			return next();
	}

	try {
		await deleteOrderOperationRecordWithinOperatorIdsAndOrderId(operatorIds, invitation.order);

		next();
	} catch (error) {
		next(error);
	}
};
