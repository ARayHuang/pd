const {
	createOrderOperationRecord,
} = require('../../../services/order-operation-record');
const { ENUM_ORDER_OPERATION_TYPE } = require('../../../lib/enum');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;

	try {
		await createOrderOperationRecord({
			orderId,
			userId: req.user._id,
			type: ENUM_ORDER_OPERATION_TYPE.READ_ORDER,
		});

		res.status(201).end();
	} catch (error) {
		next(error);
	}
};
