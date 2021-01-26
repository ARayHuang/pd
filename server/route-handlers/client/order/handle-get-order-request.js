const { pick } = require('lodash');
const {
	ORDER_PROJECTIONS,

	getOrderChannelAndHasNewActivityByIdChannelIdsAndMyUserId,
} = require('../../../services/order');
const {
	ORDER_FILE_PROJECTIONS,

	getOrderFilesByOrderId,
} = require('../../../services/order-file');
const { NotFoundError } = require('ljit-error');
const { ORDER_NOT_FOUND } = require('../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;
	const { channelIds } = res.locals;

	try {
		const order = await getOrderChannelAndHasNewActivityByIdChannelIdsAndMyUserId({
			id: orderId,
			channelIds,
			myUserId: req.user._id,
		}, {
			projections: ORDER_PROJECTIONS.ORDER,
		});

		if (order === null) {
			throw new NotFoundError(
				ORDER_NOT_FOUND.MESSAGE,
				ORDER_NOT_FOUND.CODE,
			);
		}

		const result = pick(order.toJSON(), [
			'id',
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
			'hasNewActivity',
			'channel',
		]);

		result.files = await getOrderFilesByOrderId(orderId, {
			projections: ORDER_FILE_PROJECTIONS.ORDER_FILE,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
