const { pick } = require('lodash');
const { createOrderComment } = require('../../../services/order-comment');
const {
	publisher: { publishCreatedOrderComment },
} = require('../../../lib/socket');

module.exports = async (req, res, next) => {
	const { orderId } = req.params;
	const { content } = req.body;
	const { user } = req;

	try {
		const comment = await createOrderComment({ orderId, user, content });
		const result = comment.toJSON();

		res.status(201).json(pick(result, [
			'id',
			'user.id',
			'user.displayName',
			'user.profilePictureId',
			'content',
			'createdAt',
		]));

		publishCreatedOrderComment(pick(result, [
			'id',
			'user.id',
			'user.displayName',
			'user.profilePictureId',
			'orderId',
			'content',
			'createdAt',
		]));

		res.locals.operationRecord = { orderId: orderId };

		next();
	} catch (error) {
		return next(error);
	}
};
