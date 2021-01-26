const {
	getOrdersWithinStatusChannelIdAndPagination,
} = require('../../../services/order');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = async (req, res, next) => {
	const { channelId } = req.params;
	const {
		sort, order, limit,
		page, from, to,
		handler, owner, customerName,
		status, tagId, description,
	} = req.query;

	try {
		const result = await getOrdersWithinStatusChannelIdAndPagination({ status, channelId, page }, {
			handler,
			owner,
			customerName,
			tags: (tagId === undefined ? tagId : [new ObjectId(tagId)]),
			myUserId: req.user._id,
			description,
		}, {
			order,
			sort,
			limit,
			from,
			to,
		});

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
