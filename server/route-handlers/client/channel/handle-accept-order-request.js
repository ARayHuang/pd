const {
	acceptOrderByIdAndChannelId,
} = require('../../../services/order');
const { ENUM_LOG_TYPE } = require('../../../lib/enum');
const {
	publisher: { publishUpdatedOrder },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { channelId, orderId } = req.params;

	try {
		const order = await acceptOrderByIdAndChannelId(orderId, channelId, {
			handler: req.user._id,
		});

		res.locals.log = {
			operator: req.user._id,
			type: ENUM_LOG_TYPE.ACCEPTED_ORDER,
			orderId: order._id,
		};
		res.locals.operationRecord = { orderId: order._id };

		publishUpdatedOrder(order.toJSON());
		res.status(201).end();

		next();
	} catch (error) {
		next(error);
	}
};
