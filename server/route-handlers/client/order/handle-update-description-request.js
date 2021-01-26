const {
	updateDescriptionById,
} = require('../../../services/order');
const {
	publisher: { publishUpdatedOrder },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { description } = req.body;
	const { orderId } = req.params;
	const { channelIds } = res.locals;

	try {
		const order = await updateDescriptionById(orderId, description, {
			channelIds,
		});

		publishUpdatedOrder(order.toJSON());

		res.status(204).end();

		res.locals.operationRecord = { orderId: orderId };

		next();
	} catch (error) {
		next(error);
	}
};
