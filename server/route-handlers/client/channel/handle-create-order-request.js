const { pick } = require('lodash');
const { publisher: { publishCreatedOrder } } = require('../../../lib/socket');
const {
	ENUM_LOG_TYPE,
} = require('../../../lib/enum');
const { createOrder } = require('../../../services/order');

module.exports = async (req, res, next) => {
	const { channelId } = req.params;
	const { description, customerName } = req.body;
	const { tags } = res.locals;

	try {
		const order = await createOrder({
			channelId,
			owner: req.user,
			customerName,
			tags,
			description,
		});
		const result = order.toJSON();

		res.locals.operationRecord = { orderId: order._id };
		res.locals.log = {
			operator: req.user._id,
			type: ENUM_LOG_TYPE.CREATED_ORDER,
			orderId: order._id,
		};

		res.status(201).json(pick(result, ['id']));

		publishCreatedOrder(pick(result, [
			'id',
			'owner.id',
			'owner.displayName',
			'customerName',
			'tags',
			'description',
			'status',
			'createdAt',
			'serialNumber',
			'channel',
		]));

		next();
	} catch (error) {
		return next(error);
	}
};
